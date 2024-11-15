import { Copy } from "lucide-react";
import { useNoteStore } from "@repo/lib/stores/note-store";
import { Button } from "../../button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";

import useClipboard from "@repo/lib/hooks/use-clipboard";
import { useMemo } from "react";
export default function CopyAllContent() {
    const clipboard = useClipboard();
    const notes = useNoteStore((state) => state.notes);

    const content = useMemo(() => {
        return notes.length > 0
            ? notes
                  .map((note) => note.content)
                  .reduce((prev, currVal) => prev + "\n\n" + currVal)
            : "";
    }, [notes]);

    const onCopy = () => {
        clipboard
            .copyToClipboard(content)
            .then(() => {
                // TODO : implement
            })
            .catch(() => {
                // TODO : implement
            });
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={"outline"}
                        onClick={onCopy}
                        disabled={content == ""}
                    >
                        <Copy />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Copy all content</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
