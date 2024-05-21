import { UiState } from "./types";

// TODO : save ui state, and get saved ui state

export const getDefaultUiState = (): UiState => {
  return {
    sidebar: true,
    titlebar: true,
    section: "note-viewer",
  };
};
