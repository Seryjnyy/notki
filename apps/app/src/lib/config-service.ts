// import { WorkspaceConfig } from "./workspace-store";

// TODO : get_current_workspace wth, remove it from main.rs
// export async function getCurrentWorkspace() {
//   const res = await invoke("get_current_workspace");
//   if (typeof res != "string") {
//     console.error(
//       "Error on setting current workspace, returned value is not a string."
//     );
//     return "";
//   }
//   const parsed = JSON.parse(res) as WorkspaceConfig;
//   return parsed.currentWorkspace;
// }

// export async function setCurrentWorkspace(newWorkspace: string) {
//     await invoke("set_current_workspace", {
//         newCurrentWorkspace: newWorkspace,
//     });
// }
