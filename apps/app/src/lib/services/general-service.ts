import { invoke } from "@tauri-apps/api"

export const getAppInfo = async () => {
  return await invoke("get_app_info")
}
