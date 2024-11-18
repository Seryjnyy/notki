import { FontFamilyIcon } from "@radix-ui/react-icons";
import {
    AVAILABLE_SHORTCUTS,
    useShortcut,
} from "@repo/lib/stores/shortcuts-store";
import ShortcutAwareDialogTrigger from "@repo/ui/components/shortcut/shortcut-aware-dialog-trigger";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";
import { Button } from "@repo/ui/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { DialogContent } from "@repo/ui/components/ui/dialog";
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
import { TabButton } from "@repo/ui/components/settings/tab-button";
import { cn } from "@repo/ui/lib/utils";
import { useStyleStore } from "@repo/lib/stores/style-store";
import { NavigationAwareDialog } from "../navigation-aware-components";
import { AppearanceTab } from "./appearance-tab/appearance-tab";
import { CardTab } from "./card-tab/card-tab";
import { DisplayTab } from "./display-tab/display-tab";
import { FontSelect } from "./font-tab/font-tab";
import ShortcutTab from "./shortcut-tab/shortcut-tab";

export const SettingsDialog = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const borderRadius = useStyleStore.use.borderRadius();
    const setBorderRadius = useStyleStore.use.setBorderRadius();
    const toggleSettingsShortcut = useShortcut(
        AVAILABLE_SHORTCUTS.TOGGLE_SETTINGS
    );

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
                comp: <ShortcutTab />,
            },
        ],
        [borderRadius, setBorderRadius]
    );
    const [currentTab, setCurrentTab] = useState(SETTINGS_TABS[0]!.label);

    return (
        <NavigationAwareDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ShortcutAwareDialogTrigger
                            asChild
                            shortcut={toggleSettingsShortcut}
                        >
                            <Button
                                size={"icon"}
                                variant="secondary"
                                className="group gap-2 p-2"
                            >
                                <SettingsIcon className="text-muted-foreground/60 transition-all group-hover:animate-spinOnce group-hover:text-accent-foreground" />
                            </Button>
                        </ShortcutAwareDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>
                            Settings
                            <TooltipShortcutKeys
                                shortcut={toggleSettingsShortcut}
                            />
                        </p>
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
