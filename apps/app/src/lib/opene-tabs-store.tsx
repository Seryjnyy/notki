import { createSelectors } from "@repo/lib/create-zustand-selectors";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Tab = {
    id: string;
    workspaceId: string;
    title: string;
    filepath: string;
};

interface OpenedTabsStore {
    openedTabs: Tab[];
    setOpenedTabs: (newOpenedTabs: Tab[]) => void;
    addOpenTab: (tab: Tab) => void;
    removeOpenTab: (tab: Tab | string, replaceCurrent?: boolean) => void;
    currentTabId: string;
    setCurrentTabId: (newCurrentTab: string) => void;
}

const defaults = {
    openedTabs: [],
    currentTabId: "",
};

// It will store opened tabs for all workspaces
// TODO : What happens if workspace id gets removed/changed, the data will be inaccessible
// Big issue, might need to periodically provide all valid workspace ids and remove the others
// TODO : Not 100% confident with how immer and persist are used here
const useOpenedTabsBase = create<OpenedTabsStore>()(
    immer(
        persist(
            (set) => ({
                ...defaults,
                setOpenedTabs: (newOpenedTabs) =>
                    set((state) => {
                        // Check if current tab is in opened tabs
                        // If not then set to ""
                        // TODO : Should current tab have null?

                        if (
                            !newOpenedTabs.find(
                                (x) => x.id == state.currentTabId
                            )
                        ) {
                            state.currentTabId = "";
                        }

                        state.openedTabs = newOpenedTabs;
                    }),
                setCurrentTabId: (newCurrentTab: string) =>
                    set((state) => {
                        state.currentTabId = newCurrentTab;
                    }),
                addOpenTab: (tab: Tab) =>
                    set((state) => {
                        if (state.openedTabs.find((x) => x.id == tab.id)) {
                            return;
                        }

                        state.openedTabs.push(tab);
                    }),
                removeOpenTab: (tab: Tab | string, replaceCurrent?: boolean) =>
                    set((state) => {
                        if (typeof tab == "string") {
                            if (state.currentTabId == tab) {
                                state.currentTabId = "";
                            }

                            state.openedTabs = state.openedTabs.filter(
                                (x) => x.id != tab
                            );
                            if (replaceCurrent && state.openedTabs.length > 0) {
                                state.currentTabId = state.openedTabs[0].id;
                            }

                            return;
                        }

                        if (state.currentTabId == tab.id) {
                            state.currentTabId = "";
                        }

                        state.openedTabs = state.openedTabs.filter(
                            (x) => x.id != tab.id
                        );

                        if (replaceCurrent && state.openedTabs.length > 0) {
                            state.currentTabId = state.openedTabs[0].id;
                        }
                    }),
            }),
            {
                name: "txt-viewer-tabs-storage",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

const useOpenedTabs = createSelectors(useOpenedTabsBase);

export { useOpenedTabs };
