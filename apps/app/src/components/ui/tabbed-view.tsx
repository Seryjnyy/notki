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
import { generateFileID } from "~/lib/file";
import { Tab as TabType } from "~/lib/file-services/tab-service";

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
      className={`${active ? "bg-secondary" : ""} max-w-[120px] w-[120px] flex items-center gap-2 `}
    >
      <TooltipProvider>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger>
            <div
              className={`${active ? "bg-secondary" : ""}  flex items-center gap-2 `}
              onClick={onChangeCurrentTab}
            >
              <span className="w-[80%] overflow-hidden text-ellipsis">
                {data.title}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{data.filepath}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        className="py-0 px-0 w-[20%] hover:bg-slate-500"
        variant={"ghost"}
        asChild
        onClick={() => onCloseTab()}
      >
        <Cross2Icon />
      </Button>
    </div>
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

  return (
    <div>
      <ScrollArea className="w-full whitespace-nowrap ">
        <div className="flex border-b">
          {openedTabs.map((tab) => (
            <Tab key={tab.id} data={tab} active={currentTab == tab.id} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2 h-2 " />
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
