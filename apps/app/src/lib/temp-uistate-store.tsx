// Temp ui state, no need to save any of this to file
// this includes stuff like dialogs being opened
import { create } from "zustand";

function getDefaultTempUiState() {
  return {
    settingsOpened: false,
  };
}

type TempUiState = {
  settingsOpened: boolean;
};

interface TempUiStateStore {
  tempUiState: TempUiState;
  setTempUiState: (tempUiState: TempUiState) => void;
}

const useTempUiState = create<TempUiStateStore>()((set) => ({
  tempUiState: getDefaultTempUiState(),
  setTempUiState: (newUiState) =>
    set(() => {
      console.log(newUiState);
      return { tempUiState: newUiState };
    }),
}));

export { useTempUiState };
