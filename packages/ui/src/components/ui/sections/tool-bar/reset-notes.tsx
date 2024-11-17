import {
    AVAILABLE_SHORTCUTS,
    useShortcut,
} from "@repo/lib/stores/shortcuts-store";
import { Button } from "../../button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";
import { useNoteStore } from "@repo/lib/stores/note-store";
import { RefreshCcw } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRef } from "react";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";

export default function ResetNotes() {
    const setNotes = useNoteStore((state) => state.setNotes);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const resetNotesShortcut = useShortcut(AVAILABLE_SHORTCUTS.RESTART);

    useHotkeys(
        resetNotesShortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault();
            buttonRef.current?.click();
        },
        {
            enabled: resetNotesShortcut?.enabled ?? false,
        }
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={() => setNotes([])}
                        variant={"secondary"}
                        ref={buttonRef}
                    >
                        <RefreshCcw className="mr-2 text-primary" /> Restart
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>
                        Reset notes{" "}
                        <TooltipShortcutKeys shortcut={resetNotesShortcut} />
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
