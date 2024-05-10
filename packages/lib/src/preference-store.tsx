import { getPreferences, savePreferences } from "./preferences-service";
import { create } from "zustand";
import { NoteSettings } from "./types";

interface PreferenceState {
  settings: NoteSettings;
  setSettings: (newSettings: NoteSettings) => void;
}

const usePreferenceStore = create<PreferenceState>()((set) => ({
  settings: getPreferences(),
  setSettings: (newSettings) =>
    set(() => {
      savePreferences(newSettings);
      return { settings: newSettings };
    }),
}));

export { usePreferenceStore };
