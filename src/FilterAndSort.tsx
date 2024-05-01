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
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { sortNotes } from "./lib/note-sorting";
import { useNoteStore } from "./lib/note-store";
import { usePreferenceStore } from "./lib/preference-store";
import { Order, SortBy } from "./lib/types";
import { cn } from "./lib/utils";

export default function FilterAndSort() {
  const settings = usePreferenceStore((state) => state.settings);
  const setSettings = usePreferenceStore((state) => state.setSettings);

  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);

  const onOrderChange = (newOrder: Order) => {
    setSettings({ ...settings, sort: { ...settings.sort, order: newOrder } });
    setNotes(sortNotes(notes, settings));
  };

  const onSortByChange = (newSortBy: SortBy) => {
    setSettings({ ...settings, sort: { ...settings.sort, sortBy: newSortBy } });
    setNotes(sortNotes(notes, settings));
  };

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost" }), "relative")}
            >
              <MixerVerticalIcon />
              {settings.sort.sortBy != "none" && (
                <div className="w-1 h-1 bg-primary rounded-full opacity-80 absolute top-1 right-1"></div>
              )}
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
              value={settings.sort.sortBy}
              onValueChange={(val: SortBy) => onSortByChange(val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="option-none" />
                <Label htmlFor="option-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time" id="option-time" />
                <Label htmlFor="option-time">Time</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="border p-2">
            <div>Order</div>
            <RadioGroup
              value={settings.sort.order}
              onValueChange={(val: Order) => onOrderChange(val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="option-asc" />
                <Label htmlFor="option-asc">Asc</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="option-desc" />
                <Label htmlFor="option-desc">Desc</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        {/* <Button onClick={sortNotes}>Sort</Button> */}
      </SheetContent>
    </Sheet>
  );
}
