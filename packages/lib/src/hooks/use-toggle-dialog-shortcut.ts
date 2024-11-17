import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Shortcut } from "@repo/lib/stores/shortcuts-store";

export default function useToggleDialogShortcut(
    shortcut: Shortcut | undefined,
    dialogTriggerRef: React.RefObject<HTMLButtonElement>
) {
    useHotkeys(
        shortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault();
            dialogTriggerRef.current?.click();
        },
        {
            enabled: shortcut?.enabled ?? false,
        }
    );
}
