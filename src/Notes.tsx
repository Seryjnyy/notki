import { useEffect } from "react";
import NoteCard from "./components/ui/note-card";
import { useNoteStore } from "./lib/note-store";
import { Button } from "./components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);

  useEffect(() => {
    console.log("note change", notes);
  }, [notes]);

  return (
    <div className="flex gap-4 flex-col h-fit">
      <Button onClick={() => setNotes([])} variant={"ghost"}>
        <UpdateIcon />
      </Button>
      {notes.map((note, index) => (
        <NoteCard title={note.fileName} key={note.fileName + index}>
          <pre>{note.content}</pre>
        </NoteCard>
      ))}
    </div>
  );
}
