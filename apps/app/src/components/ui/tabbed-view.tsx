import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea, ScrollBar } from "@repo/ui/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

import { useHotkeys } from "react-hotkeys-hook";
import { Tab, useOpenedTabs } from "~/lib/opene-tabs-store";
import NoteTakingPage from "../note-taking-page";
import { cn } from "~/lib/utils";

interface TabProps {
    active: boolean;
    tab: Tab;
}
const TabItem = ({ active, tab }: TabProps) => {
    const setCurrentTabId = useOpenedTabs.use.setCurrentTabId();
    const removeOpenTab = useOpenedTabs.use.removeOpenTab();

    const onCloseTab = async () => {
        // TODO:  unsaved changes?

        removeOpenTab(tab, true);
    };

    const onChangeCurrentTab = () => {
        setCurrentTabId(tab.id);
    };

    return (
        <div
            className={cn(
                "flex justify-between gap-2   py-1 pr-1 group items-center ",
                {
                    "bg-primary text-primary-foreground rounded-t-lg ": active,
                }
            )}
        >
            <TooltipProvider>
                <Tooltip delayDuration={1000}>
                    <TooltipTrigger>
                        <div
                            // className={`${active && "bg-card"} `}
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
            <div className="flex-1/4 w-4 h-4 ">
                <Button
                    className="hover:bg-secondary w-4 h-4 rounded-md hover:text-secondary-foreground p-1 group-hover:block hidden cursor-pointer"
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
    const removeOpenTab = useOpenedTabs.use.removeOpenTab();

    useHotkeys(
        "ctrl+w",
        () => {
            if (currentTabId == "") return;

            removeOpenTab(currentTabId, true);
        },
        { enableOnFormTags: true }
    );

    return (
        <div>
            <ScrollArea className="w-full whitespace-nowrap border-b">
                <div className="flex bg-stone-950 ">
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
