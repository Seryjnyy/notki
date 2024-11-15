import { NoteSettings, NoteView } from "../types/types";

const PREFERENCE_STORE = "txt-viewer-preferences";

// TODO : this will be deprecated when app is updated to new www-test stuff
// Preferences in general will be removed so will this function, and also services folder

export function getDefaultPreferences(): NoteSettings {
    const preferences: NoteSettings = {
        metadata: {
            visible: false,
            options: { size: true, lastModified: true, characterCount: true },
        },
        header: {
            visible: true,
            options: {
                title: true,
                actions: {
                    visible: true,
                    options: { copy: false, remove: true },
                },
            },
        },
        sort: { sortBy: "none", order: "asc" },
        content: {
            letterSpacing: getDefaultLetterSpacing(),
            lineHeight: getDefaultLineHeight(),
        },
        styling: {
            note: {
                paddingX: getDefaultPaddingX(),
                paddingTop: getDefaultPaddingTop(),
                paddingBottom: getDefaultPaddingBottom(),
                textSelectable: true,
            },
            list: {
                columns: getDefaultColumns(),
                paddingX: getDefaultListPaddingX(),
            },
            content: {
                fontSize: getDefaultFontSize(),
            },
        },
        view: getDefaultNoteView(),
    };
    savePreferences(preferences);

    return preferences;
}

// Why functions?
export const getDefaultLetterSpacing = () => 0;
export const getDefaultLineHeight = () => 1.25;
export const getDefaultPaddingX = () => 1;
export const getDefaultPaddingTop = () => 0;
export const getDefaultPaddingBottom = () => 1.5;
export const getDefaultColumns = () => 1;
export const getDefaultFontSize = () => 1;
export const getDefaultNoteView = (): NoteView => "all";
export const getDefaultListPaddingX = () => 2;

export function removePreferences() {
    localStorage.removeItem(PREFERENCE_STORE);
}

export function savePreferences(preferences: NoteSettings) {
    localStorage.setItem(PREFERENCE_STORE, JSON.stringify(preferences));
}

export function getPreferences() {
    const store = localStorage.getItem(PREFERENCE_STORE);

    if (!store) {
        return getDefaultPreferences();
    }

    // WARN : BLINDLY TRUSTING HERE
    const parsed: NoteSettings = JSON.parse(store);

    return parsed;
}
