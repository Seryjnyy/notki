import { createSelectors } from "@repo/lib/utils/create-zustand-selectors";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const AVAILABLE_SHORTCUTS = {
    NEXT_NOTE: "next-note",
    PREVIOUS_NOTE: "previous-note",
} as const;

type Shortcut = {
    hotkeys: string[];
    defaultHotkeys: string[];
    id: string;
    enabled: boolean;
    label: string;
};

type State = {
    shortcuts: Shortcut[];
};

const defaults: State = {
    shortcuts: [
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
    ],
};

interface Actions {
    toggleShortcut: (id: string) => void;
    reset: () => void;
}

const useShortcutsStoreBase = create<State & Actions>()(
    persist(
        (set) => ({
            ...defaults,
            toggleShortcut: (id) => {
                set((state) => {
                    const actionIndex = state.shortcuts.findIndex(
                        (a) => a.id === id
                    );
                    if (actionIndex === -1) return state;

                    const newActions = [...state.shortcuts];
                    newActions[actionIndex] = {
                        ...newActions[actionIndex],
                        enabled: !newActions[actionIndex].enabled,
                    };

                    return { shortcuts: newActions };
                });
            },
            reset: () => set(defaults),
        }),
        {
            name: "shortcuts-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useShortcutsStore = createSelectors(useShortcutsStoreBase);

export { useShortcutsStore };
