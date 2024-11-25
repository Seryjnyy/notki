import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

import { SidebarTrigger, useSidebar } from "@repo/ui/components/ui/sidebar";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";
import {
    AVAILABLE_SHORTCUTS,
    useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store";

export default function AppSidebarTrigger() {
    const { open } = useSidebar();
    const toggleSidebarShortcut = useShortcutInfo(
        AVAILABLE_SHORTCUTS.TOGGLE_SIDEBAR
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {open ? "Close sidebar" : "Open sidebar"}
                        <TooltipShortcutKeys shortcut={toggleSidebarShortcut} />
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
