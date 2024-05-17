// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use tauri::{App, Manager, Window};

use nanoid::nanoid;

use notify::{RecommendedWatcher, RecursiveMode, Result, Watcher};

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

#[tauri::command]
fn get_existing_vaults() -> serde_json::Value {
    let file = fs::File::open("./config.json").expect("file should open read only");

    let json: serde_json::Value =
        serde_json::from_reader(file).expect("file should be proper JSON");

    return json;
}

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
struct ConfigData {
    current_workspace: String,
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

fn main() {
    // let filePaths = fs::read_to_string("config.t")
    // let data = fs::read_to_string("")

    // For now errors crash the app completely
    if let Some(proj_dirs) = ProjectDirs::from("com", "", "app.txt-viewer") {
        let config_dir = proj_dirs.config_dir();
        // deal with error
        let config_file_exists = config_dir
            .join("config.json")
            .try_exists()
            .expect("Checking if config.json exists failed.");

        let config_file_path = Path::new(&config_dir).join("config.json");
        if !config_file_exists {
            // create config dir
            if let Err(err) = fs::create_dir_all(&config_dir) {
                panic!("Failed to create the config folder.")
            }

            // TODO : Change this
            let data = ConfigData {
                current_workspace: "C:\\Users\\jakub\\Documents\\test".to_string(),
            };

            // create config file
            let file = File::create(&config_file_path).expect("Failed to create the config file.");
            let mut writer = BufWriter::new(file);
            serde_json::to_writer(&mut writer, &data)
                .expect("Failed to create a writer for config data.");
            writer.flush().expect("Failed to flush config writer.");
        }

        let mut temp_config_path = CONFIG_PATH.lock().unwrap();
        *temp_config_path = config_file_path.clone();

        // read from file
        // println!("{}", &temp_config_path);

        // update file
    }

    // let temp_config_path = CONFIG_PATH.lock().unwrap();
    // let contents = fs::read_to_string(&*temp_config_path.clone()).expect("Couldn't read config.");
    // println!("{}", contents)

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_existing_vaults, see_allowed])
        .plugin(tauri_plugin_fs_extra::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .setup(|app| {
            // File watching
            let temp_config_path = CONFIG_PATH.lock().unwrap();
            println!("{}", &temp_config_path.to_str().unwrap());
            // TODO : Could specifically emit to one workspace, if title of window had the workspace name
            // Does it emit to other windows that are new instances of the app? or just the one apps multiple windows?
            let app_handle = app.app_handle();
            let mut watcher = notify::recommended_watcher(|res| match res {
                Ok(event) => {
                    println!("event: {:?}", event);

                    // app_handle.emit_all("event", "payload").expect("s");
                }
                Err(e) => println!("watch error: {:?}", e),
            })
            .expect("Couldn't create a file watcher.");

            watcher
                .watch(
                    PathBuf::from("C:\\Users\\jakub\\Documents\\test".to_owned()).as_path(),
                    RecursiveMode::Recursive,
                )
                .unwrap();

            // File watching

            //     let file_paths = fs::read_to_string("./config.txt");
            //     match file_paths {
            //         Ok(paths) => {
            //             let results = paths.lines();
            //             for part in results.clone() {
            //                 println!("{}", part);
            //                 let res = app
            //                     .fs_scope()
            //                     .allow_directory(part, true)
            //                     .map_err(|err| err.to_string());
            //                 match res {
            //                     Ok(a) => println!("Path added"),
            //                     Err(error) => println!("couldn't allow directory"),
            //                 }
            //             }
            //             println!("{}", results.count())
            //         }
            //         Err(error) => {
            //             println!("oh no")
            //         }
            //     }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
