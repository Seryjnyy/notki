import { ScrollArea, ScrollBar } from "@repo/ui/scroll-area";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { invoke } from "@tauri-apps/api";

interface TabProps {
  title: string;
  tooltip: string;
  active: boolean;
}
const Tab = ({
  title,
  tooltip,
  active,
  ...props
}: TabProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            {...props}
            className={`${active ? "bg-gray-800" : "bg-muted-foreground"} max-w-[120px] w-[120px]`}
          >
            {title}
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function TabbedView() {
  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);
  const currentTab = useOpenedTabs((state) => state.currentTab);
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);

  useEffect(() => {
    const setUp = async () => {
      const res: string = await invoke("get_opened_tabs_config");

      const parsed = JSON.parse(res) as {
        current_tab: string;
        opened_tabs: { id: string; title: string; filepath: string }[];
      };
      console.log("🚀 ~ parsed ~ parsed:", parsed);

      setOpenedTabs(parsed.opened_tabs);
      setCurrentTab(parsed.current_tab);
    };

    setUp();
    console.log(openedTabs);
  }, []);

  const onChangeCurrentTab = (tabID: string) => {
    // save to config

    setCurrentTab(tabID);
  };

  return (
    <div>
      <ScrollArea className="w-[96vw] whitespace-nowrap ">
        <div className="flex">
          {openedTabs.map((tab) => (
            <Tab
              key={tab.id}
              title={tab.title}
              tooltip={"tab.tooltip"}
              active={currentTab == tab.id}
              onClick={() => onChangeCurrentTab(tab.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2 h-2 " />
      </ScrollArea>
      {currentTab == "" && <div>No tabs open</div>}
      {/* {currentTabIndex >= 0 && currentTabIndex < openedTabs.length && ( */}
      {currentTab != "" && <div>{"some"}</div>}
    </div>
  );
}
