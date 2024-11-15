import { create } from "zustand";
import { createSelectors } from "../utils/create-zustand-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
    replace: boolean;
};

interface Actions {
    setReplace: (replace: boolean) => void;
}

const defaults: State = {
    replace: true,
};

const useUploadSettingsStoreBase = create<State & Actions>()(
    persist(
        (set) => ({
            ...defaults,
            setReplace: (replace) => set(() => ({ replace })),
        }),
        {
            name: "upload-settings",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useUploadSettingsStore = createSelectors(useUploadSettingsStoreBase);

export { useUploadSettingsStore };
