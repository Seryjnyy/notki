import { create } from "zustand";
import { UiState } from "./types";

// TODO : save ui state, and get saved ui state
const getDefaultUiState = (): UiState => {
  return {
    sidebar: true,
    sideSection: "none",
    titlebar: true,
    section: "note-manager",
  };
};

interface UiStateStore {
  uiState: UiState;
  setUiState: (uiState: UiState) => void;
}

const useUiState = create<UiStateStore>()((set) => ({
  uiState: getDefaultUiState(),
  setUiState: (newUiState) =>
    set(() => {
      // savePreferences(newSettings);
      console.log(newUiState);
      return { uiState: newUiState };
    }),
}));

export { useUiState };
