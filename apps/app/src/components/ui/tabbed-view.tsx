import { Button } from "@repo/ui/button";
import { ScrollArea, ScrollBar } from "@repo/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import React, { useEffect, useState } from "react";
import { getFileContent, saveFile } from "~/lib/file-services/file-service";
import {
  changeStoredCurrentTab,
  changeStoredOpenedTabs,
  getStoredTabConfig,
} from "~/lib/file-services/tab-service";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import NoteTakingPage from "../note-taking-page";
import { generateFileID } from "~/lib/file";
import { Tab as TabType } from "~/lib/file-services/tab-service";
import { Cross1Icon } from "@radix-ui/react-icons";

interface TabProps {
  active: boolean;
  data: TabType;
}
const Tab = ({ active, data }: TabProps) => {
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);
  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);

  const onCloseTab = async () => {
    // unsaved changes

    // remove from opened tabs
    const removed = openedTabs.filter((tab) => {
      return tab.id != data.id;
    });

    setOpenedTabs(removed);
    changeStoredOpenedTabs(removed);

    // change current tab
    setCurrentTab(removed.length > 0 ? removed[0].id : "");
  };

  const onChangeCurrentTab = () => {
    console.log("ho shti");
    setCurrentTab(data.id);
    changeStoredCurrentTab(data.id);
  };

  return (
    <div
      className={`${active && "bg-card "}  flex justify-between gap-2  border-l py-1 pr-1`}
    >
      <TooltipProvider>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger>
            <div
              className={`${active && "bg-card"} `}
              onClick={onChangeCurrentTab}
            >
              <span className="flex-3/4 overflow-hidden text-ellipsis pl-2 text-sm">
                {data.title}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{data.filepath}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex-1/4">
        <Button
          className="hover:bg-primary w-4 h-4 rounded-md hover:text-primary-foreground p-1"
          variant={"ghost"}
          asChild
          size={"icon"}
          onClick={() => onCloseTab()}
        >
          <Cross1Icon className="w-2 h-2" scale={1} />
        </Button>
      </div>
    </div>
  );
};

export default function TabbedView() {
  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);
  const currentTab = useOpenedTabs((state) => state.currentTab);
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);

  useEffect(() => {
    const setUp = async () => {
      //   const res: string = await invoke("get_opened_tabs_config");

      const openedTabsConfig = await getStoredTabConfig();
      setOpenedTabs(openedTabsConfig.openedTabs);
      setCurrentTab(openedTabsConfig.currentTab);
      //   const parsed = JSON.parse(res) as {
      //     current_tab: string;
      //     opened_tabs: { id: string; title: string; filepath: string }[];
      //   };
      //   console.log("🚀 ~ parsed ~ parsed:", parsed);

      //   setOpenedTabs(parsed.opened_tabs);
      //   setCurrentTab(parsed.current_tab);
    };

    setUp();
    console.log(openedTabs);
  }, []);

  return (
    <div>
      <ScrollArea className="w-full whitespace-nowrap ">
        <div className="flex bg-secondary">
          {openedTabs.map((tab) => (
            <Tab key={tab.id} data={tab} active={currentTab == tab.id} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-4 h-2" />
      </ScrollArea>
      {currentTab == "" && <div>No tabs open</div>}
      {/* {currentTabIndex >= 0 && currentTabIndex < openedTabs.length && ( */}
      {currentTab != "" && (
        <div>
          <NoteTakingPage
            filepath={openedTabs.find((tab) => tab.id == currentTab)?.filepath}
          />
        </div>
      )}
    </div>
  );
}
