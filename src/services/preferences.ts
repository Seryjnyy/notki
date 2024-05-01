import { NoteSettings } from "@/lib/types";

const PREFERENCE_STORE = "txt-viewer-preferences";

export function getDefaultPreferences(): NoteSettings {
  const preferences: NoteSettings = {
    titles: true,
    metadata: {
      visible: false,
      options: { size: true, lastModified: true, characterCount: true },
    },
    actions: { visible: true, options: { remove: true, copy: false } },
    sort: { sortBy: "none", order: "asc" },
    content: { letterSpacing: "normal", lineHeight: "normal" },
  };
  savePreferences(preferences);

  return preferences;
}

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
