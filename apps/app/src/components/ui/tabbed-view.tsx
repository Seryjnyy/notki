import { Cross2Icon } from "@radix-ui/react-icons";
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
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);
  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);

  const onCloseTab = () => {
    // unsaved changes

    // remove from opened tabs
    const removed = openedTabs.filter((tab) => tab.title != title);
    setOpenedTabs(removed);
    changeStoredOpenedTabs(removed);

    // change current tab
    setCurrentTab(removed.length > 0 ? removed[0].title : "");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            {...props}
            className={`${active ? "bg-secondary" : ""} max-w-[120px] w-[120px] flex items-center gap-2`}
          >
            <span className="w-[80%] overflow-hidden text-ellipsis">
              {title}
            </span>
            <Button
              className="py-0 px-0 w-[20%] hover:bg-slate-500"
              variant={"ghost"}
              asChild
              onClick={() => onCloseTab()}
            >
              <Cross2Icon />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FileContent = ({ filepath }: { filepath: string }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const setUp = async () => {
      const res = await getFileContent(filepath);

      setContent(res);
    };

    setUp();
  }, [filepath]);

  return <div>{content}</div>;
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

  const onChangeCurrentTab = (tabID: string) => {
    setCurrentTab(tabID);
    changeStoredCurrentTab(tabID);
  };

  return (
    <div>
      <ScrollArea className="w-full whitespace-nowrap ">
        <div className="flex border-b">
          {openedTabs.map((tab) => (
            <Tab
              key={tab.title}
              title={tab.title}
              tooltip={"tab.tooltip"}
              active={currentTab == tab.title}
              onClick={() => onChangeCurrentTab(tab.title)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2 h-2 " />
      </ScrollArea>
      {currentTab == "" && <div>No tabs open</div>}
      {/* {currentTabIndex >= 0 && currentTabIndex < openedTabs.length && ( */}
      {currentTab != "" && (
        <div>
          <NoteTakingPage
            filepath={
              openedTabs.find((tab) => tab.title == currentTab)?.filepath
            }
          />
        </div>
      )}
    </div>
  );
}
