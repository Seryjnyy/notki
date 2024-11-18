import { createSelectors } from "@repo/lib/utils/create-zustand-selectors";
import { formatLocalStorageKey } from "@repo/lib/utils/local-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const BORDER_RADIUS_OPTIONS = [0, 4, 8, 12, 16, 20];

export const FONT_OPTIONS = [
    "Poppins",
    "Reddit Sans",
    "Roboto Mono",
    "DM Mono",
    "Ubuntu Mono",
    "JetBrains Mono",
    "Helvetica Neue",
] as const;

type State = {
    font: string;
    borderRadius: number;
    style: string;
    userFonts: string[];
};

const defaults: State = {
    font: FONT_OPTIONS[2],
    borderRadius: 8,
    style: "carbon",
    userFonts: [],
};

interface Actions {
    setFont: (font: string) => void;
    setBorderRadius: (radius: number) => void;
    setStyle: (style: string) => void;
    setUserFonts: (fonts: string[]) => void;
    reset: (fields?: (keyof State)[]) => void;
}

const useStyleStoreBase = create<State & Actions>()(
    persist(
        (set) => ({
            ...defaults,
            setFont: (font) => set({ font }),
            setBorderRadius: (borderRadius) => set({ borderRadius }),
            setStyle: (style) => set({ style }),
            setUserFonts: (userFonts) => set({ userFonts }),
            reset: (fields?: (keyof State)[]) =>
                set((state) => {
                    if (!fields) {
                        return defaults;
                    }

                    const resetState: Partial<State> = {};
                    fields.forEach((field) => {
                        // TODO : ignoring a ts-error here, same issue as note-display-settings-store.ts, works fine but shows an error
                        // @ts-expect-error it thinks its trying to assign to unknown field when there wont be any unknown fields
                        resetState[field] = defaults[field];
                    });

                    return {
                        ...state,
                        ...resetState,
                    };
                }),
        }),
        {
            name: formatLocalStorageKey("style-store"),
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useAllFonts = () => {
    const userFonts = useStyleStore((state) => state.userFonts);
    return [...userFonts, ...FONT_OPTIONS];
};

const useStyleStore = createSelectors(useStyleStoreBase);

export { useStyleStore };
