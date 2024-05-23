import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { readFile } from "fs";
import { z } from "zod";

type TabConfig = {
  currentTab: string;
  openedTabs: Tab[];
};

const zTab = z.object({
  id: z.string(),
  title: z.string(),
  filepath: z.string(),
});

export type Tab = z.infer<typeof zTab>;

const zOpenedTabs = z.object({
  currentTab: z.string(),
  openedTabs: z.array(zTab),
});

type OpenedTabs = z.infer<typeof zOpenedTabs>;

export const getStoredTabConfig = async () => {
  const res = await readTextFile("config\\opened-tabs.json", {
    dir: BaseDirectory.AppConfig,
  });
  let parsed: OpenedTabs;
  try {
    parsed = JSON.parse(res);

    zOpenedTabs.parse(parsed);
    return parsed;
  } catch (error) {
    console.error("Couldn't parse opened-tabs.json");
    return { currentTab: "", openedTabs: [] };
  }
};

export const changeStoredCurrentTab = async (newCurrentTab: string) => {
  const config = await getStoredTabConfig();

  config.currentTab = newCurrentTab;

  writeTextFile("config\\opened-tabs.json", JSON.stringify(config), {
    dir: BaseDirectory.AppConfig,
  });
};

export const changeStoredOpenedTabs = async (newOpenedTabs: Tab[]) => {
  const config = await getStoredTabConfig();

  config.openedTabs = newOpenedTabs;
  console.log("saving new config", config);
  writeTextFile("config\\opened-tabs.json", JSON.stringify(config), {
    dir: BaseDirectory.AppConfig,
  });
};
