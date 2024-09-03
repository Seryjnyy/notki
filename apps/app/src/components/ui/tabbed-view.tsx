import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { ScrollArea, ScrollBar } from "@repo/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/tooltip";
import { useEffect } from "react";

import { Tab, useOpenedTabs } from "~/lib/opene-tabs-store";
import NoteTakingPage from "../note-taking-page";
import { invoke } from "@tauri-apps/api";
import { saveFile } from "~/lib/file-services/file-service";

interface TabProps {
    active: boolean;
    tab: Tab;
}
const TabItem = ({ active, tab }: TabProps) => {
    const setCurrentTabId = useOpenedTabs.use.setCurrentTabId();
    const removeOpenTab = useOpenedTabs.use.removeOpenTab();

    const onCloseTab = async () => {
        // TODO:  unsaved changes?

        removeOpenTab(tab);
    };

    const onChangeCurrentTab = () => {
        setCurrentTabId(tab.id);
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
                                {tab.title}
                            </span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>{tab.filepath}</TooltipContent>
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
    const openedTabs = useOpenedTabs.use.openedTabs();
    const currentTabId = useOpenedTabs.use.currentTabId();

    return (
        <div>
            <Button
                onClick={() => {
                    // invoke("test_write_file", {
                    //     filepath: "C:\\tempForStupid\\fsdfewakh.txt",
                    //     content: "mukahfiodsn noifonisd ",
                    // });
                    // invoke("see_allowed");
                    saveFile(
                        "C:\\Users\\User\\Pictures\\apt\\kurde\\apton.txt",
                        "some stuff"
                    );
                }}
            >
                save to file
            </Button>
            <ScrollArea className="w-full whitespace-nowrap ">
                <div className="flex bg-secondary">
                    {openedTabs.map((tab) => (
                        <TabItem
                            key={tab.id}
                            tab={tab}
                            active={currentTabId == tab.id}
                        />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="mt-4 h-2" />
            </ScrollArea>
            {currentTabId == "" && (
                <div className="w-full bg-red-600">No tabs open</div>
            )}
            {/* {currentTabIndex >= 0 && currentTabIndex < openedTabs.length && ( */}
            {currentTabId != "" && (
                <div>
                    <NoteTakingPage
                        filepath={
                            openedTabs.find((tab) => tab.id == currentTabId)
                                ?.filepath
                        }
                    />
                </div>
            )}
        </div>
    );
}
