import { formatHotKeys } from "~/lib/utils";
import { Shortcut } from "@repo/lib/stores/shortcuts-store";

export default function TooltipShortcutKeys({
    shortcut,
}: {
    shortcut: Shortcut | undefined;
}) {
    if (!shortcut) return null;

    if (!shortcut.enabled) return null;

    return (
        <>
            <br />
            {`(${formatHotKeys(shortcut.hotkeys)})`}
        </>
    );
}
