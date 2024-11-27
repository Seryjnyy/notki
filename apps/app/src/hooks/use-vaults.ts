import { useEffect } from "react"
import { Vault } from "~/lib/backend-types"
import { getVaults } from "~/lib/vaults"
import { atom, useAtom } from "jotai"

// Provides initial value for useVaults since this is shared between the instances of the hook
const vaultsAtom = atom<Vault[]>([])
const useVaultsAtom = () => useAtom(vaultsAtom)

export default function useVaults() {
  const [vaults, setVaults] = useVaultsAtom()

  const refetchVaults = async () => {
    const fetchedVaults = await getVaults()
    setVaults(fetchedVaults)
    return fetchedVaults
  }

  useEffect(() => {
    const setUp = async () => {
      setVaults(await getVaults())
    }

    setUp()
  }, [setVaults])

  return {
    vaults,
    refetchVaults,
  }
}
