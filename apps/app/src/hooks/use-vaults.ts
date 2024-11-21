import { useEffect, useState } from "react";
import { Vault } from "~/lib/backend-types";
import { getVaults } from "~/lib/vaults";

export default function useVaults() {
    const [vaults, setVaults] = useState<Vault[]>([]);

    const refetchVaults = async () => {
        setVaults(await getVaults());
    };

    useEffect(() => {
        refetchVaults();
    }, []);

    return {
        vaults,
        refetchVaults,
    };
}
