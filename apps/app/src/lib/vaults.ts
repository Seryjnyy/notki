import { invoke } from "@tauri-apps/api";

import { Config, Vault } from "./backend-types";

// TODO : Fetching entire config then getting vaults, not great
export const getVaults = async (): Promise<Vault[]> => {
    try {
        // const res = (await invoke("get_existing_vaults")) as {
        //     vaults: Vault[];
        // };
        // TODO : Should validate JSON here
        // TODO : Could get types from rust with things like io-ts
        const res = (await invoke("get_config")) as Config;
        const vaults = res.vaults;
        console.log(vaults);
        // invoke("see_allowed");
        return vaults;
    } catch (err) {
        console.error("Failed to read get vaults", err);
        return [];
    }
};

export const addVault = async (
    name: string,
    filepath: string
): Promise<boolean> => {
    // TODO : add_vault in rust should return true/false if succeeded
    await invoke("add_vault", { name: name, filepath: filepath });
    return true;
};
