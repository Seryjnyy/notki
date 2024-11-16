import { FontFamilyIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Tabs, TabsContent } from "@repo/ui/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import {
    LayoutPanelLeft,
    MenuIcon,
    NotebookText,
    PaintbrushIcon,
    Scissors,
    SettingsIcon,
    XIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { TabButton } from "~/components/compound-ui/tab-button";
import { cn } from "~/lib/utils";
import { useStyleStore } from "~/stores/style-store";
import { NavigationAwareDialog } from "../compound-ui/navigation-aware-components";
import { AppearanceTab } from "./appearance-tab/appearance-tab";
import { CardTab } from "./card-tab/card-tab";
import { DisplayTab } from "./display-tab/display-tab";
import { FontSelect } from "./font-tab/font-tab";

export const SettingsDialog = () => {
    const dialogTriggerRef = useRef<HTMLButtonElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const borderRadius = useStyleStore.use.borderRadius();
    const setBorderRadius = useStyleStore.use.setBorderRadius();

    const SETTINGS_TABS = useMemo(
        () => [
            {
                label: "Font",
                icon: (
                    <FontFamilyIcon className="rounded-sm border border-foreground/10" />
                ),
                comp: <FontSelect />,
            },

            {
                label: "Appearance",
                icon: <PaintbrushIcon className="h-4 w-4" />,
                comp: (
                    <AppearanceTab
                        setBorderRadius={setBorderRadius}
                        borderRadius={borderRadius}
                    />
                ),
            },
            {
                label: "Card",
                icon: <NotebookText className="h-4 w-4" />,
                comp: <CardTab />,
            },
            {
                label: "Display",
                icon: <LayoutPanelLeft className="h-4 w-4" />,
                comp: <DisplayTab />,
            },
            {
                label: "Shortcuts",
                icon: <Scissors className="h-4 w-4" />,
                comp: <div>hello</div>,
            },
        ],
        [borderRadius, setBorderRadius]
    );
    const [currentTab, setCurrentTab] = useState(SETTINGS_TABS[0].label);
    // useHotkeys(KEYBINDS.SETTINGS.hotkey, () => {
    //   dialogTriggerRef.current?.click()
    // })

    return (
        <NavigationAwareDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                ref={dialogTriggerRef}
                                variant="secondary"
                                className="group gap-2 p-2"
                            >
                                <SettingsIcon className="text-muted-foreground/60 transition-all group-hover:animate-spinOnce group-hover:text-accent-foreground" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>Settings</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="flex h-[90vh] sm:h-3/4 flex-col sm:flex-row w-full max-w-5xl overflow-hidden">
                <div className="max-h-full w-fit hidden sm:block">
                    <h2 className="mb-4 text-2xl font-bold">Settings</h2>
                    <div className="flex w-[12rem] flex-col gap-2">
                        {SETTINGS_TABS.map((tab) => (
                            <TabButton
                                key={tab.label}
                                label={tab.label}
                                icon={tab.icon}
                                isActive={currentTab === tab.label}
                                setCurrentTab={setCurrentTab}
                            />
                        ))}
                    </div>
                </div>
                <Collapsible
                    open={isMobileMenuOpen}
                    onOpenChange={setIsMobileMenuOpen}
                    className={cn(
                        "mt-4 pt-1 px-2  sm:hidden",
                        isMobileMenuOpen &&
                            "border-t  border-b backdrop-brightness-95"
                    )}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CollapsibleTrigger className="mb-2" asChild>
                                    <Button variant={"ghost"} size={"icon"}>
                                        {!isMobileMenuOpen ? (
                                            <MenuIcon />
                                        ) : (
                                            <XIcon />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>
                                    {isMobileMenuOpen
                                        ? "Close menu"
                                        : "Open menu"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <CollapsibleContent className="pb-2">
                        <div className="flex flex-wrap gap-1">
                            {SETTINGS_TABS.map((tab) => (
                                <TabButton
                                    key={tab.label}
                                    label={tab.label}
                                    icon={tab.icon}
                                    isActive={currentTab === tab.label}
                                    setCurrentTab={setCurrentTab}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-1 flex-col">
                    <h2 className="mb-4 text-xl font-bold">{currentTab}</h2>
                    <ScrollArea className="w-full overflow-y-auto h-[70vh] sm:h-full">
                        <Tabs
                            className="pb-8 pl-1 pr-4"
                            value={currentTab}
                            orientation="vertical"
                            defaultValue="font"
                        >
                            {SETTINGS_TABS.map(({ label, comp }) => {
                                return (
                                    <TabsContent key={label} value={label}>
                                        {comp}
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    </ScrollArea>
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
};
