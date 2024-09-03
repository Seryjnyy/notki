// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::sync::{Arc, Mutex};
use tauri::{App, AppHandle, Manager, Window};
use typeshare::typeshare;

use nanoid::nanoid;

use notify::{ReadDirectoryChangesWatcher, RecommendedWatcher, RecursiveMode, Result, Watcher};

use std::io::{BufWriter, Write};
use std::path::{Path, PathBuf};
use std::sync::mpsc::channel;
// use std::fs;
use lazy_static::lazy_static;

use std::{collections::HashSet, fs::File};

struct AppState {
    config_path: String,
}

lazy_static! {
    static ref CONFIG_PATH: Mutex<PathBuf> = Mutex::new(PathBuf::new());
    static ref OPENED_TABS_PATH: Mutex<PathBuf> = Mutex::new(PathBuf::new());
}

// use tauri::Manager;

// #[tauri::command]
// fn expand_scope(app_handle: tauri::AppHandle, folder_path: String) -> Result<(), String> {
//     // If possible, verify your path if it comes from your frontend.
//     println!("something");
//     println!("{}", folder_path);
//     // true means that we want inner directories allowed too
//     app_handle
//         .fs_scope()
//         .allow_directory("C:\\Users\\jakub\\Documents\\test", true)
//         .map_err(|err| err.to_string())
// }

// #[tauri::command]
// fn create_new_vault(app_handle: tauri::AppHandle, folder_path: String) -> Result<(), String> {
//     // Check if path already in allowed
//     println!("{}", folder_path);
//     app_handle
//         .fs_scope()
//         .allow_directory(folder_path, true)
//         .map_err(|err| err.to_string());

//     Ok(())
// }

use std::fs;

use directories::ProjectDirs;
use serde::Serialize;
use tauri::{GlobPattern, Pattern};

#[derive(Serialize)]
#[typeshare]
struct Vault {
    id: String,
    name: String,
    filepath: String,
}

#[derive(Serialize)]
#[typeshare]
#[serde(rename_all = "camelCase")]
struct Config {
    current_workspace: String,
    vaults: Vec<Vault>,
}

// TODO : Problem is if workspaces are added to config, but config is removed the user will not know
// what they gave access to.#
#[tauri::command]
fn add_vault(name: String, filepath: String) -> serde_json::Value {
    // Get existing vaults from the config
    let mut config = get_config();
    let vaults = config
        .get("vaults")
        .expect("Could not find vaults inside config.");
    let mut vaults_copy = vaults.clone();

    // Add the new vault to the array
    // TODO : Probably should have something to check against duplicate id
    if let Some(vaults_arr) = vaults_copy.as_array_mut() {
        vaults_arr.push(json!({
            "id": nanoid!(),
            "name":name,
            "filepath":filepath
        }));

        // Save config with new values
        let val = Value::Array(vaults_arr.clone());
        config["vaults"] = val;

        let contents_updated_json =
            serde_json::to_string_pretty(&config).expect("Failed to serialise content.");

        let path = CONFIG_PATH.lock().unwrap();
        fs::write(&*path, contents_updated_json)
            .expect("Failed to write updated opened_tabs config.");
    }

    println!("{:?}", vaults_copy);
    return config;
}

#[tauri::command]
fn test_write_file(filepath: String, content: String) {

    // let _ = fs::write(filepath, content);
}

#[tauri::command]
fn get_config() -> serde_json::Value {
    let temp_config_path = CONFIG_PATH.lock().unwrap();
    let file = fs::File::open(temp_config_path.as_path()).expect("file should open read only");

    let json: serde_json::Value =
        serde_json::from_reader(file).expect("file should be proper JSON");

    return json;
}

#[tauri::command]
fn get_existing_vaults() -> serde_json::Value {
    let file = fs::File::open("./config.json").expect("file should open read only");

    let json: serde_json::Value =
        serde_json::from_reader(file).expect("file should be proper JSON");

    return json;
}

// TODO : Not sure why this is here anymore
#[tauri::command]
fn see_allowed(app_handle: tauri::AppHandle) {
    let hash_set = tauri::scope::FsScope::allowed_patterns(&app_handle.fs_scope());

    for value in &hash_set {
        println!("{}", value);
    }
}

// fn get_config
// fn manage_config

#[derive(Serialize)]
struct OpenedTab {
    id: String,
    title: String,
    filepath: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OpenedTabsData {
    current_tab: String,
    opened_tabs: Vec<OpenedTab>,
}

// fn create_file() {
//     let id = nanoid!(16);

//     let title = "Untitled@".to_owned() + &id;
//     let filepath =
//         PathBuf::from(CONFIG_PATH.lock().unwrap().clone()).join(format!("{}.txt", &title));

//     let _ = fs::write();
// }

// Scan files for current workspace
// send to frontend

fn find_opened_tabs_path() {
    if let Some(proj_dirs) = ProjectDirs::from("com", "", "app.txt-viewer") {
        let config_dir = proj_dirs.config_dir();
        let file_name = "opened-tabs.json";
        // deal with error
        let file_exists = config_dir
            .join(file_name)
            .try_exists()
            .expect(&format!("Checking if {} exists failed.", file_name));

        let opened_tabs_path = Path::new(&config_dir).join(file_name);

        // If config file does not exist then create one first
        if !file_exists {
            // Create config folder
            if let Err(_err) = fs::create_dir_all(&config_dir) {
                panic!("Failed to create the config folder.")
            }

            // TODO : Change this
            // Default data for opened tabs file
            let data = OpenedTabsData {
                current_tab: "".to_owned(),
                opened_tabs: vec![
                    // OpenedTab {
                    //     id: String::from("first_id"),
                    //     title: String::from("first time"),
                    //     filepath: String::from("first file path"),
                    // },
                    // OpenedTab {
                    //     id: String::from("second_id"),
                    //     title: String::from("second time"),
                    //     filepath: String::from("second file path"),
                    // },
                ],
            };

            // Write default data to file
            let file = File::create(&opened_tabs_path).expect("Failed to create the config file.");
            let mut writer = BufWriter::new(file);
            serde_json::to_writer(&mut writer, &data)
                .expect("Failed to create a writer for config data.");
            writer.flush().expect("Failed to flush config writer.");
        }

        // Save opened_tabs path to global variable
        let mut temp_opened_tabs_path = OPENED_TABS_PATH.lock().unwrap();
        *temp_opened_tabs_path = opened_tabs_path.clone();
    }
}

#[tauri::command]
fn get_opened_tabs_config() -> String {
    let temp_opened_tabs_path = OPENED_TABS_PATH.lock().unwrap();

    let contents = fs::read_to_string(&*temp_opened_tabs_path).expect("Couldn't read config.");
    return contents;
}

fn set_current_tab(new_current_tab: String) {
    let contents = get_opened_tabs_config();
    let mut contents_parsed: Value =
        serde_json::from_str(&contents).expect("Couldn't parse json file.");

    contents_parsed["currentTab"] = Value::from(new_current_tab);

    let contents_updated_json =
        serde_json::to_string_pretty(&contents_parsed).expect("Failed to serialise content.");

    let path = OPENED_TABS_PATH.lock().unwrap();
    fs::write(&*path, contents_updated_json).expect("Failed to write updated opened_tabs config.");
}

fn find_config_path() {
    if let Some(proj_dirs) = ProjectDirs::from("com", "", "app.txt-viewer") {
        // Check if file exists
        let config_dir = proj_dirs.config_dir();
        let config_file_exists = config_dir
            .join("config.json")
            .try_exists()
            .expect("Checking if config.json exists failed.");

        let config_file_path = Path::new(&config_dir).join("config.json");

        // If file does not exist then create one first
        if !config_file_exists {
            // Create config folder
            if let Err(err) = fs::create_dir_all(&config_dir) {
                // TODO : Probably not good to just throw this
                panic!("Failed to create the config folder.")
            }

            // TODO : Change this
            // Default data for config file
            let default_data = Config {
                current_workspace: "".to_string(),
                vaults: Vec::new(),
            };

            // Write default data to new config file
            let file = File::create(&config_file_path).expect("Failed to create the config file.");
            let mut writer = BufWriter::new(file);
            serde_json::to_writer(&mut writer, &default_data)
                .expect("Failed to create a writer for config data.");
            writer.flush().expect("Failed to flush config writer.");
        }

        // Save config path to variable
        let mut temp_config_path = CONFIG_PATH.lock().unwrap();
        *temp_config_path = config_file_path.clone();
    }
}

// fn new_file_created(app_handle: tauri::AppHandle) {
//     app_handle.emit_all("new_file_created", "")
// }

#[tauri::command]
// TODO : get_config
fn get_current_workspace() -> String {
    let temp_path = CONFIG_PATH.lock().unwrap();

    let contents = fs::read_to_string(&*temp_path).expect("Couldn't read config.");
    return contents;
}

#[tauri::command]
fn set_current_workspace(new_current_workspace: String) -> String {
    let contents = get_current_workspace();

    let mut contents_parsed: Value =
        serde_json::from_str(&contents).expect("Couldn't parse json file.");

    contents_parsed["currentWorkspace"] = Value::from(new_current_workspace.clone());

    let contents_updated_json =
        serde_json::to_string_pretty(&contents_parsed).expect("Failed to serialise content.");

    let path = CONFIG_PATH.lock().unwrap();
    fs::write(&*path, contents_updated_json).expect("Failed to write updated opened_tabs config.");
    return new_current_workspace.to_owned();
}

fn main() {
    // let filePaths = fs::read_to_string("config.t")
    // let data = fs::read_to_string("")
    find_opened_tabs_path();
    find_config_path();
    // set_current_tab("a new current tab please".to_owned());
    // For now errors crash the app completely

    // let temp_config_path = CONFIG_PATH.lock().unwrap();
    // let contents = fs::read_to_string(&*temp_config_path.clone()).expect("Couldn't read config.");
    // println!("{}", contents)
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_existing_vaults,
            get_opened_tabs_config,
            see_allowed,
            get_current_workspace,
            set_current_workspace,
            get_config,
            add_vault,
            test_write_file
        ])
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_fs_extra::init())
        .setup(|app| {
            //     //     let file_paths = fs::read_to_string("./config.txt");
            //     //     match file_paths {
            //     //         Ok(paths) => {
            //     //             let results = paths.lines();
            //     //             for part in results.clone() {
            //     //                 println!("{}", part);
            //     //                 let res = app
            //     //                     .fs_scope()
            //     //                     .allow_directory(part, true)
            //     //                     .map_err(|err| err.to_string());
            //     //                 match res {
            //     //                     Ok(a) => println!("Path added"),
            //     //                     Err(error) => println!("couldn't allow directory"),
            //     //                 }
            //     //             }
            //     //             println!("{}", results.count())
            //     //         }
            //     //         Err(error) => {
            //     //             println!("oh no")
            //     //         }
            //     //     }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("Reaches end")
}
