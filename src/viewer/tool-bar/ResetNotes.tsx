import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNoteStore } from "@/lib/note-store";
import { UpdateIcon } from "@radix-ui/react-icons";
export default function ResetNotes() {
  const setNotes = useNoteStore((state) => state.setNotes);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setNotes([])} variant={"ghost"}>
            <UpdateIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset notes</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
