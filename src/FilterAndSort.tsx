import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNoteStore } from "./lib/note-store";
import { Button, buttonVariants } from "./components/ui/button";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

export default function FilterAndSort() {
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);

  const onSortAscending = () => {
    // setNotes(notes.sort((a, b) => a.lastModified - b.lastModified));
    setNotes([...notes].sort((a, b) => b.lastModified - a.lastModified));
  };

  const onSortDescending = () => {
    setNotes([...notes].sort((a, b) => a.lastModified - b.lastModified));
    // setNotes(notes.sort((a, b) => b.lastModified - a.lastModified));
  };

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
              <MixerVerticalIcon />
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter and sort</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <div>
          <div className="border p-2">
            <div>Sort by</div>
            <RadioGroup
              defaultValue="option-one"
              value={settings.lineHeight}
              onValueChange={(
                val: "tight" | "snug" | "normal" | "relaxed" | "loose"
              ) => setSettings((prev) => ({ ...prev, lineHeight: val }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="option-normal" />
                <Label htmlFor="option-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tight" id="option-tight" />
                <Label htmlFor="option-tight">Tight</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            Order
            <Button onClick={onSortAscending}>SortAsc</Button>
            <Button onClick={onSortDescending}>SortDes</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
