import { invoke } from "@tauri-apps/api";
import { create } from "zustand";

type Tab = {
  id: string;
  title: string;
  filepath: string;
};

interface OpenedTabsStore {
  openedTabs: Tab[];
  setOpenedTabs: (newOpenedTabs: Tab[]) => void;
  currentTab: string;
  setCurrentTab: (newCurrentTab: string) => void;
}

// TODO : Get stored list from backend
const getDefaultOpenedTabs = () => {
  return [];
};

// TODO : Get from saved state.
const getDefaultCurrentTab = () => {
  return "";
};

const useOpenedTabs = create<OpenedTabsStore>()((set) => ({
  openedTabs: getDefaultOpenedTabs(),
  setOpenedTabs: (newOpenedTabs) => set(() => ({ openedTabs: newOpenedTabs })),
  currentTab: getDefaultCurrentTab(),
  setCurrentTab: (newCurrentTab: string) =>
    set(() => ({ currentTab: newCurrentTab })),
}));

export { useOpenedTabs };
