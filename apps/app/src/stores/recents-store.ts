import { createSelectors } from "@repo/lib/utils/create-zustand-selectors";
import { formatLocalStorageKey } from "@repo/lib/utils/local-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENTS = 10;

export type Recent = {
    path: string;
    lastOpened: number;
    recursive?: boolean;
};

type State = {
    recents: Recent[];
};

interface Actions {
    addRecent: (path: string, recursive?: boolean) => void;
    removeRecent: (path: string) => void;
    clearRecents: () => void;
}

const DEFAULTS: State = {
    recents: [],
};

// path needs to be unique, acts as primary key
const useRecentsStoreBase = create<State & Actions>()(
    persist(
        (set) => {
            return {
                ...DEFAULTS,
                addRecent: (path: string, recursive?: boolean) => {
                    set((state) => {
                        const newRecents = state.recents.filter(
                            (recent) => recent.path !== path
                        );
                        newRecents.unshift({
                            path,
                            lastOpened: Date.now(),
                            recursive,
                        });

                        if (newRecents.length > MAX_RECENTS) {
                            return {
                                recents: newRecents.slice(0, MAX_RECENTS),
                            };
                        }

                        return { recents: newRecents };
                    });
                },
                removeRecent: (path: string) => {
                    set((state) => {
                        const newRecents = state.recents.filter(
                            (recent) => recent.path !== path
                        );
                        return { recents: newRecents };
                    });
                },
                clearRecents: () => {
                    set({ recents: [] });
                },
            };
        },
        {
            name: formatLocalStorageKey("recents-store"),
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useRecentsStore = createSelectors(useRecentsStoreBase);

export const useGetSortedRecents = () => {
    const recents = useRecentsStore((state) => state.recents);
    return recents.sort((a, b) => b.lastOpened - a.lastOpened);
};

export { useRecentsStore };
