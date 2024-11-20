import { Check, ChevronsUpDown } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import { useSidebarCurrentView } from "./app-sidebar";

export function CurrentViewSwitcher() {
    const { currentView, setCurrentView, availableViews } =
        useSidebarCurrentView();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <span>
                                    {
                                        availableViews.find(
                                            (view) => view.value === currentView
                                        )?.icon
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">View</span>
                                <span className="">{currentView}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width]"
                        align="start"
                    >
                        {availableViews.map((view) => (
                            <DropdownMenuItem
                                key={view.value}
                                onSelect={() => setCurrentView(view.value)}
                            >
                                {view.label}{" "}
                                {view.value === currentView && (
                                    <Check className="ml-auto" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
