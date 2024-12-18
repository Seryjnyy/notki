import { createSelectors } from "@repo/lib/utils/create-zustand-selectors"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { formatLocalStorageKey } from "../utils/local-storage"
import { useMemo } from "react"

// TODO : this is not an ideal approach ibr, www will get pc related shortcuts
export const PC_APP_EXCLUSIVE_SHORTCUTS = {
  TOGGLE_SIDEBAR: "toggle-sidebar",
  TOGGLE_OPEN_FOLDER: "toggle-open-folder",
  TOGGLE_OPEN_MANAGE_VAULTS: "toggle-open-manage-vaults",
  TOGGLE_FULLSCREEN: "toggle-fullscreen",
  TOGGLE_QUICK_SETTINGS: "toggle-quick-settings",
}

export const AVAILABLE_SHORTCUTS = {
  NEXT_NOTE: "next-note",
  PREVIOUS_NOTE: "previous-note",
  RESTART: "restart",
  TOGGLE_UPLOAD: "toggle-upload",
  TOGGLE_FILTER: "toggle-filter", // TODO Bit confusing since filter and sort dialog is more sorting/ordering, whereas search is considered filtering in the useNoteFilterStore, idk what to do about it tbh, it works for me but yk
  TOGGLE_SEARCH: "toggle-search",
  TOGGLE_NOTE_MAP: "toggle-note-map",
  COPY_ALL_CONTENT: "copy-all-content",
  TOGGLE_SETTINGS: "toggle-settings",
  TOGGLE_BOTTOM_BAR: "toggle-bottom-bar",
  REMOVE_CURRENT_NOTE: "remove-current-note",
  ...PC_APP_EXCLUSIVE_SHORTCUTS,
} as const

type AvailableShortcut =
  (typeof AVAILABLE_SHORTCUTS)[keyof typeof AVAILABLE_SHORTCUTS]

export type Shortcut = {
  hotkeys: string[]
  defaultHotkeys: string[]
  id: AvailableShortcut
  enabled: boolean
  label: string
}

type State = {
  sharedShortcuts: Shortcut[]
  pcExclusiveShortcuts: Shortcut[]
}

// TODO : naming needs to be uniform
const defaults: State = {
  sharedShortcuts: [
    {
      hotkeys: ["down", "right"],
      defaultHotkeys: ["down", "right"],
      id: AVAILABLE_SHORTCUTS.NEXT_NOTE,
      label: "Next note",
      enabled: true,
    },
    {
      hotkeys: ["up", "left"],
      defaultHotkeys: ["up", "left"],
      id: AVAILABLE_SHORTCUTS.PREVIOUS_NOTE,
      label: "Previous note",
      enabled: true,
    },
    {
      hotkeys: ["alt+r"],
      defaultHotkeys: ["alt+r"],
      id: AVAILABLE_SHORTCUTS.RESTART,
      label: "Restart",
      enabled: true,
    },
    {
      hotkeys: ["u"],
      defaultHotkeys: ["u"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_UPLOAD,
      label: "Toggle upload",
      enabled: true,
    },
    {
      hotkeys: ["f"],
      defaultHotkeys: ["f"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_FILTER,
      label: "Toggle filter",
      enabled: true,
    },
    {
      hotkeys: ["s"],
      defaultHotkeys: ["s"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_SEARCH,
      label: "Toggle search",
      enabled: true,
    },
    {
      hotkeys: ["c"],
      defaultHotkeys: ["c"],
      id: AVAILABLE_SHORTCUTS.COPY_ALL_CONTENT,
      label: "Copy all content",
      enabled: true,
    },
    {
      hotkeys: ["e"],
      defaultHotkeys: ["e"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_SETTINGS,
      label: "Toggle settings",
      enabled: true,
    },
    {
      hotkeys: ["m"],
      defaultHotkeys: ["m"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_NOTE_MAP,
      label: "Toggle note map",
      enabled: true,
    },
    {
      hotkeys: ["h"],
      defaultHotkeys: ["h"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_BOTTOM_BAR,
      label: "Toggle bottom bar",
      enabled: true,
    },
    {
      hotkeys: ["alt+w"],
      defaultHotkeys: ["alt+w"],
      id: AVAILABLE_SHORTCUTS.REMOVE_CURRENT_NOTE,
      label: "Remove current note",
      enabled: true,
    },
  ],
  pcExclusiveShortcuts: [
    {
      hotkeys: ["t"],
      defaultHotkeys: ["t"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_SIDEBAR,
      label: "Toggle sidebar",
      enabled: true,
    },
    {
      hotkeys: ["o"],
      defaultHotkeys: ["o"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_OPEN_FOLDER,
      label: "Toggle open folder",
      enabled: true,
    },
    {
      hotkeys: ["v"],
      defaultHotkeys: ["v"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_OPEN_MANAGE_VAULTS,
      label: "Toggle open manage vaults",
      enabled: true,
    },
    {
      hotkeys: ["f11"],
      defaultHotkeys: ["f11"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_FULLSCREEN,
      label: "Toggle fullscreen",
      enabled: true,
    },
    {
      hotkeys: ["ctrl+`"],
      defaultHotkeys: ["ctrl+`"],
      id: AVAILABLE_SHORTCUTS.TOGGLE_QUICK_SETTINGS,
      label: "Toggle quick settings",
      enabled: true,
    },
  ],
}

interface Actions {
  toggleShortcut: (id: string, enabled?: boolean) => void
  reset: () => void
}

const toggleShortcutEnabledHelper = (
  shortcuts: Shortcut[],
  index: number,
  enabled?: boolean
): Shortcut[] => {
  const newShortcuts = [...shortcuts]
  const shortcut = newShortcuts[index]
  if (!shortcut) return shortcuts

  newShortcuts[index] = {
    ...shortcut,
    enabled: enabled ?? !shortcut.enabled,
  }
  return newShortcuts
}

const useShortcutsStoreBase = create<State & Actions>()(
  persist(
    (set) => ({
      ...defaults,
      toggleShortcut: (id, enabled) => {
        set((state) => {
          const actionIndex = state.sharedShortcuts.findIndex(
            (a) => a.id === id
          )

          // This first looks in standard shortcuts, if not found, it looks in pc exclusive shortcuts
          // If not found in pc exclusive shortcuts, it returns the state as is
          // but if found in either it creates the updated array for either shortcut list and then updates it
          if (actionIndex === -1) {
            const pcActionIndex = state.pcExclusiveShortcuts.findIndex(
              (a) => a.id === id
            )

            if (pcActionIndex === -1) {
              return state
            }

            const newActions = toggleShortcutEnabledHelper(
              state.pcExclusiveShortcuts,
              pcActionIndex,
              enabled
            )

            return { pcExclusiveShortcuts: newActions }
          } else {
            const newActions = toggleShortcutEnabledHelper(
              state.sharedShortcuts,
              actionIndex,
              enabled
            )

            return { sharedShortcuts: newActions }
          }
        })
      },
      reset: () => set(defaults),
    }),
    {
      name: formatLocalStorageKey("shortcuts-store"),
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// TODO : could maybe be more efficient, but its okay for now
// TODO : should things be separate, have a hook for standard shortcuts and pc exclusive shortcuts?
export const useShortcutInfo = (id: AvailableShortcut) => {
  const shared = useShortcutsStore.use.sharedShortcuts()
  const pcExclusive = useShortcutsStore.use.pcExclusiveShortcuts()
  const all = useMemo(() => [...shared, ...pcExclusive], [shared, pcExclusive])
  return all.find((a) => a.id === id)
}

const useShortcutsStore = createSelectors(useShortcutsStoreBase)

export { useShortcutsStore }
