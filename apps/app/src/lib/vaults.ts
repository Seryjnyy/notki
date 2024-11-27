import { invoke } from "@tauri-apps/api"

import { Config, Vault } from "./backend-types"

// TODO : why is this in lib, why is it named vaults? This should be done better.

// TODO : Fetching entire config then getting vaults, not great
// https://github.com/tauri-apps/tauri/issues/3434
export const getVaults = async (): Promise<Vault[]> => {
  try {
    // TODO : Should maybe validate JSON here
    const res = (await invoke("get_config")) as Config
    return res.vaults
  } catch (err) {
    console.error("Failed to read get vaults", err)
    return []
  }
}

// Returns created vault
export const addVault = async (
  name: string,
  filepath: string
): Promise<{ error: string | null; data: Vault | null }> => {
  const vaults = await getVaults()

  if (vaults.some((vault) => vault.filepath === filepath)) {
    console.error("Vault already exists at this location, ", filepath)
    return { error: "Vault already exists", data: null }
  }

  // add_vault returns the config file because i cba to mess around with rust rn
  const res = (await invoke("add_vault", {
    name: name,
    filepath: filepath,
  })) as Config

  return {
    error: null,
    data:
      res?.vaults.find(
        (vault) => vault.name === name && vault.filepath === filepath
      ) ?? null,
  }
}

export const removeVault = async (id: string) => {
  await invoke("remove_vault", { id: id })
}

export const editVaultName = async (id: string, name: string) => {
  return (await invoke("edit_vault_name", { id: id, newName: name })) as Config
}
