import { create } from "zustand";
import { UiState } from "./types";
import { createSelectors } from "@repo/lib/create-zustand-selectors";

// TODO : save ui state, and get saved ui state
const defaults: UiState = {
    sidebar: true,
    sideSection: "none",
    titlebar: true,
    section: "note-manager",
    settings: false,
};

interface UiStateStore {
    uiState: UiState;
    setUiState: (uiState: UiState) => void;
}

const useUiStateBase = create<UiStateStore>()((set) => ({
    uiState: defaults,
    setUiState: (newUiState) =>
        set(() => {
            console.log(newUiState);
            return { uiState: newUiState };
        }),
}));

const useUiState = createSelectors(useUiStateBase);

export { useUiState };
