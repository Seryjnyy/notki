import { NoteSettings } from "@/lib/types";

const PREFERENCE_STORE = "txt-viewer-preferences";

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
        actions: { visible: true, options: { copy: false, remove: true } },
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
      },
      list: {
        columns: getDefaultColumns(),
      },
      content: {
        fontSize: getDefaultFontSize(),
      },
    },
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
