import { createSelectors } from "@repo/lib/create-zustand-selectors";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type NoteDisplay = "grid" | "slideshow";

// TODO : this stuff is really all over the place, note settings is done through hooks, but this is done straight through zustand, this needs more consistency!!!!!
type Display = {
    cols: number;
    colsGap: number;
    display: NoteDisplay;
    paddingX: number;
    paddingY: number;
};

type ResetableField = keyof Display;

const defaults: Display = {
    cols: 1,
    colsGap: 20,
    display: "grid",
    paddingX: 24,
    paddingY: 12,
};

export const limits = {
    cols: { min: 1, max: 12 },
    colsGap: { min: 0, max: 100 },
    paddingX: { min: 0, max: 100 },
    paddingY: { min: 0, max: 100 },
};

interface Actions {
    setCols: (cols: number) => void;
    setColsGap: (colsGap: number) => void;
    setDisplay: (display: NoteDisplay) => void;
    setPaddingX: (paddingX: number) => void;
    setPaddingY: (paddingY: number) => void;
    reset: (fields?: ResetableField[]) => void;
}

const useNoteDisplaySettingsBase = create<Display & Actions>()(
    persist(
        (set) => ({
            ...defaults,
            setCols: (cols) => set({ cols }),
            setColsGap: (colsGap) => set({ colsGap }),
            setDisplay: (display) => set({ display }),
            setPaddingX: (paddingX) => set({ paddingX }),
            setPaddingY: (paddingY) => set({ paddingY }),
            reset: (fields) =>
                set((state) => {
                    if (!fields || fields.length === 0) {
                        return defaults;
                    }

                    const updates: Partial<Display> = {};
                    fields.forEach((field) => {
                        // TODO : ignoring a ts-error here, functionality seems good but it shows and error about types, need to investigate cause 1 reset func instead
                        // of 5 is better imo, and if more properties are added then yh
                        // @ts-ignore
                        updates[field] = defaults[field];
                    });
                    return { ...state, ...updates };
                }),
        }),
        {
            name: "note-display-settings",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useNoteDisplaySettings = createSelectors(useNoteDisplaySettingsBase);

export { useNoteDisplaySettings };
