// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::sync::Mutex;
use tauri::Manager;
use typeshare::typeshare;

use nanoid::nanoid;

use std::process::Command;

use std::io::{BufWriter, Write};
use std::path::{Path, PathBuf};

use lazy_static::lazy_static;

use std::fs::File;

lazy_static! {
    static ref CONFIG_PATH: Mutex<PathBuf> = Mutex::new(PathBuf::new());
    static ref OPENED_TABS_PATH: Mutex<PathBuf> = Mutex::new(PathBuf::new());
}

// TODO : currently opens the parent folder, idk if it should open inside it
// TODO : unused Results, can be an error that is not handled, (other functions have ? at the end, unsure how to handle)
// TODO : untested on other platforms
// But works for now
#[tauri::command]
async fn show_in_explorer(path: String) -> Result<(), String> {
    // TODO : No error handling whatsoever
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        if let Ok(output) = Command::new("xdg-mime")
            .args(["query", "default", "inode/directory"])
            .output()
        {
            let desktop_file = String::from_utf8_lossy(&output.stdout);

            if desktop_file.contains("nautilus") {
                Command::new("nautilus")
                    .args(["--select", &path])
                    .spawn()
                    .map_err(|e| e.to_string())?;
            } else if desktop_file.contains("dolphin") {
                Command::new("dolphin")
                    .args(["--select", &path])
                    .spawn()
                    .map_err(|e| e.to_string())?;
            } else {
                // Fallback to just opening the containing folder
                if let Some(parent) = std::path::Path::new(&path).parent() {
                    Command::new("xdg-open")
                        .arg(parent)
                        .spawn()
                        .map_err(|e| e.to_string())?;
                }
            }
        }
    }

    Ok(())
}

use std::fs;

use directories::ProjectDirs;
use serde::Serialize;

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
        config["vaults"] = Value::Array(vaults_arr.clone());

        let contents_updated_json =
            serde_json::to_string_pretty(&config).expect("Failed to serialise content.");

        let path = CONFIG_PATH.lock().unwrap();
        fs::write(&*path, contents_updated_json)
            .expect("Failed to write updated opened_tabs config.");
    }

    println!("{:?}", vaults_copy);
    return config;
}

// TODO : lots of duplicate code with add_vault, remove_vault, edit_vault_name
#[tauri::command]
fn edit_vault_name(id: String, new_name: String) -> serde_json::Value {
    // Get existing vaults from the config
    let mut config = get_config();
    let vaults = config
        .get("vaults")
        .expect("Could not find vaults inside config.");
    let mut vaults_copy = vaults.clone();

    // Add the new vault to the array
    // TODO : Probably should have something to check against duplicate id
    if let Some(vaults_arr) = vaults_copy.as_array_mut() {
        // Find the vault by id and update its name
        if let Some(vault) = vaults_arr.iter_mut().find(|v| v["id"] == id) {
            vault["name"] = serde_json::Value::String(new_name);
        } else {
            println!("Vault with id {} not found", id);
        }
        // Save config with new values
        config["vaults"] = Value::Array(vaults_arr.clone());

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
fn remove_vault(id: String) -> serde_json::Value {
    // Get existing vaults from the config
    let mut config = get_config();
    let vaults = config
        .get("vaults")
        .expect("Could not find vaults inside config.");
    let mut vaults_copy = vaults.clone();

    // Add the new vault to the array
    // TODO : Probably should have something to check against duplicate id
    if let Some(vaults_arr) = vaults_copy.as_array_mut() {
        vaults_arr.retain(|vault| {
            vault
                .get("id")
                .and_then(|v| v.as_str())
                .map_or(true, |vault_id| vault_id != id)
        });

        // Save config with new values
        config["vaults"] = Value::Array(vaults_arr.clone());

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
fn get_config() -> serde_json::Value {
    let temp_config_path = CONFIG_PATH.lock().unwrap();
    let file = fs::File::open(temp_config_path.as_path()).expect("file should open read only");

    let json: serde_json::Value =
        serde_json::from_reader(file).expect("file should be proper JSON");

    return json;
}

// Function to see scopes (test after adding a vault to see if its been added to the scopes)
#[tauri::command]
fn test_func_see_allowed_scopes(app_handle: tauri::AppHandle) {
    let hash_set = tauri::scope::FsScope::allowed_patterns(&app_handle.fs_scope());

    for value in &hash_set {
        println!("{}", value);
    }
}

fn find_config_path() {
    if let Some(proj_dirs) = ProjectDirs::from("com", "", "app.txt-viewer") {
        // Check if file exists
        let config_dir = proj_dirs.config_local_dir();
        let config_file_exists = config_dir
            .join("config.json")
            .try_exists()
            .expect("Checking if config.json exists failed.");

        let config_file_path = Path::new(&config_dir).join("config.json");

        // If file does not exist then create one first
        if !config_file_exists {
            // Create config folder
            if let Err(_err) = fs::create_dir_all(&config_dir) {
                // TODO : Probably not good to just throw this
                panic!("Failed to create the config folder.")
            }

            // TODO : Change this
            // Default data for config file
            let default_data = Config { vaults: Vec::new() };

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

fn main() {
    find_config_path();

    // TODO: For now errors crash the app completely

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_config,
            add_vault,
            edit_vault_name,
            remove_vault,
            show_in_explorer,
            test_func_see_allowed_scopes
        ])
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_fs_extra::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
