import { Button } from "../../button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../tooltip";
import { useNoteStore } from "@repo/lib/note-store";
import { CopyIcon, UpdateIcon } from "@radix-ui/react-icons";

import { useEffect, useMemo } from "react";
import useClipboard from "@repo/lib/use-clipboard";
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

  console.log(content);

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
          <Button variant={"ghost"} onClick={onCopy} disabled={content == ""}>
            <CopyIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy all content</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
