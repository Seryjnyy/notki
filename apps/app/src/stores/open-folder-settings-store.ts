import { createSelectors } from "@repo/lib/utils/create-zustand-selectors";
import { formatLocalStorageKey } from "@repo/lib/utils/local-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
    recursive: boolean;
    multiple: boolean;
};

interface Actions {
    setRecursive: (value: boolean) => void;
    setMultiple: (value: boolean) => void;
    resetSettings: () => void;
}

const DEFAULTS: State = {
    recursive: false,
    multiple: false,
};

// TODO : does this really need an entire store? idk, but its quick and easy for now so why not
const useOpenFolderSettingsStoreBase = create<State & Actions>()(
    persist(
        (set) => ({
            ...DEFAULTS,
            setRecursive: (value: boolean) => set({ recursive: value }),
            setMultiple: (value: boolean) => set({ multiple: value }),
            resetSettings: () => set(DEFAULTS),
        }),
        {
            name: formatLocalStorageKey("open-folder-settings-store"),
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useOpenFolderSettingsStore = createSelectors(
    useOpenFolderSettingsStoreBase
);

export { useOpenFolderSettingsStore };
