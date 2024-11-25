import {
    AVAILABLE_SHORTCUTS,
    useShortcut,
} from "@repo/lib/stores/shortcuts-store";
import { useSidebar } from "@repo/ui/components/ui/sidebar";
import { useHotkeys } from "react-hotkeys-hook";

// This could also be a hook tbh, not sure which fits better.
//
// Need to be careful with these shortcut components/hooks because there is no check to ensure that the shortcut is
// registered only once. This could lead to multiple event listeners being registered for the same shortcut.
export default function AppSidebarShortcut() {
    const { toggleSidebar } = useSidebar();
    const toggleSidebarShortcut = useShortcut(
        AVAILABLE_SHORTCUTS.TOGGLE_SIDEBAR
    );

    useHotkeys(
        toggleSidebarShortcut?.hotkeys.join(",") ?? "",
        () => {
            toggleSidebar();
        },
        { enabled: toggleSidebarShortcut?.enabled ?? false }
    );

    return null;
}
