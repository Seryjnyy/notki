import { Button } from "../../button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";
import { useNoteStore } from "@repo/lib/note-store";
import { UpdateIcon } from "@radix-ui/react-icons";
export default function ResetNotes() {
    const setNotes = useNoteStore((state) => state.setNotes);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => setNotes([])} variant={"secondary"}>
                        <UpdateIcon className="mr-2 text-primary" /> Restart
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>Reset notes</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
