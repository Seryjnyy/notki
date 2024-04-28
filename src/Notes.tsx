import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GearIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import NoteCard from "./components/ui/note-card";
import { useNoteStore } from "./lib/note-store";

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);
  const [settings, setSettings] = useState({ titles: true });

  useEffect(() => {
    console.log("note change", JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="flex gap-4 flex-col h-fit">
      <div>
        <Button onClick={() => setNotes([])} variant={"ghost"}>
          <UpdateIcon />
        </Button>

        <Sheet>
          <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
            <GearIcon />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <div className="pt-12">
              <div className="flex items-center gap-2">
                See titles
                <Checkbox
                  checked={settings.titles}
                  onCheckedChange={(checked) => {
                    if (checked == "indeterminate") return;

                    setSettings((prev) => ({ ...prev, titles: checked }));
                  }}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {notes.map((note, index) => (
        <NoteCard
          title={note.fileName}
          key={note.fileName + index}
          seeTitles={settings.titles}
        >
          {note.content}
        </NoteCard>
      ))}
    </div>
  );
}
