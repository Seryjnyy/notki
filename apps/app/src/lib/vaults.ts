import { invoke } from "@tauri-apps/api";
import { Vault } from "./types";

// TODO : Fetching entire config then getting vaults, not great
export const getVaults = async (): Promise<Vault[]> => {
  try {
    const res = (await invoke("get_existing_vaults")) as {
      vaults: Vault[];
    };
    return res.vaults;
  } catch (err) {
    console.error("Failed to read get vaults", err);
    return [];
  }
};
