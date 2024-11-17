import { useNoteStore } from "@repo/lib/stores/note-store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";

import { CopyButton } from "@repo/ui/components/copy-button";
import { useMemo, useRef } from "react";
import {
    AVAILABLE_SHORTCUTS,
    useShortcut,
} from "@repo/lib/stores/shortcuts-store";
import { useHotkeys } from "react-hotkeys-hook";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";

export default function CopyAllContent() {
    const notes = useNoteStore.use.notes();
    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const copyAllContentShortcut = useShortcut(
        AVAILABLE_SHORTCUTS.COPY_ALL_CONTENT
    );

    const content = useMemo(() => {
        return notes.length > 0
            ? notes
                  .map((note) => note.content)
                  .reduce((prev, currVal) => prev + "\n\n" + currVal)
            : "";
    }, [notes]);

    useHotkeys(
        copyAllContentShortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault();
            copyButtonRef.current?.click();
        },
        {
            enabled: copyAllContentShortcut?.enabled ?? false,
        }
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <CopyButton value={content} ref={copyButtonRef} />
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>
                        Copy all content{" "}
                        <TooltipShortcutKeys
                            shortcut={copyAllContentShortcut}
                        />
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
