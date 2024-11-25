import { invoke } from "@tauri-apps/api";

import { Config, Vault } from "./backend-types";

// TODO : Fetching entire config then getting vaults, not great
export const getVaults = async (): Promise<Vault[]> => {
    try {
        // TODO : Should maybe validate JSON here
        const res = (await invoke("get_config")) as Config;
        const vaults = res.vaults;

        return vaults;
    } catch (err) {
        console.error("Failed to read get vaults", err);
        return [];
    }
};

export const addVault = async (
    name: string,
    filepath: string
): Promise<{ error: string | null }> => {
    // TODO : add_vault in rust should return true/false if succeeded
    const vaults = await getVaults();

    if (vaults.some((vault) => vault.filepath === filepath)) {
        console.error("Vault already exists at this location, ", filepath);
        return { error: "Vault already exists" };
    }

    await invoke("add_vault", { name: name, filepath: filepath });
    return { error: null };
};
