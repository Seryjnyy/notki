import { Button } from "../../button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";
import { useNoteStore } from "@repo/lib/stores/note-store";
import { RefreshCcw } from "lucide-react";

export default function ResetNotes() {
    const setNotes = useNoteStore((state) => state.setNotes);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => setNotes([])} variant={"secondary"}>
                        <RefreshCcw className="mr-2 text-primary" /> Restart
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Reset notes</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
