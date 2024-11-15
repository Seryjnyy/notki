import {
    getPreferences,
    savePreferences,
} from "../services/preferences-service";
import { create } from "zustand";
import { NoteSettings } from "../types/types";

// TODO : this will soon be deprecated when app is updated to new www-test stuff
// settings are now stored in separate stores

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
