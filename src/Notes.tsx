import { useEffect } from "react";
import NoteCard from "./components/ui/note-card";
import { useNoteStore } from "./lib/note-store";

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);

  useEffect(() => {
    console.log("note change", notes);
  }, [notes]);

  return (
    <div>
      {notes.map((note, index) => (
        <NoteCard title={note.fileName} key={note.fileName + index}>
          <pre>{note.content}</pre>
        </NoteCard>
      ))}
    </div>
  );
}
