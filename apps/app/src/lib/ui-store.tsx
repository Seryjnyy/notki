import { create } from "zustand";
import { UiState } from "./types";
import { getDefaultUiState } from "./ui-state";

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
