import { useNoteStore } from "@repo/lib/stores/note-store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";

import { CopyButton } from "@repo/ui/components/copy-button";
import { useMemo } from "react";
export default function CopyAllContent() {
    const notes = useNoteStore.use.notes();

    const content = useMemo(() => {
        return notes.length > 0
            ? notes
                  .map((note) => note.content)
                  .reduce((prev, currVal) => prev + "\n\n" + currVal)
            : "";
    }, [notes]);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <CopyButton value={content} />
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Copy all content</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
