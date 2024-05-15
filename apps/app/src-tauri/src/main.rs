// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::fs;
use std::collections::HashSet;

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

use tauri::{GlobPattern, Manager, Pattern};

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

fn main() {
    // let filePaths = fs::read_to_string("config.t")

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_existing_vaults, see_allowed])
        .plugin(tauri_plugin_fs_extra::init())
        .plugin(tauri_plugin_persisted_scope::init())
        // .setup(|app| {
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
        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
