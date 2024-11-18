import { useNoteStore } from "@repo/lib/stores/note-store";
import { Note } from "../types/types";

// TODO : Is there a need for this?
export const useNotes = () => {
    const notes = useNoteStore.use.notes();
    const setNotes = useNoteStore.use.setNotes();

    const addNote = (note: Note) => {
        setNotes([...notes, note]);
    };

    const removeNote = (noteId: string) => {
        setNotes(notes.filter((note: Note) => note.id !== noteId));
    };

    return {
        notes,
        addNote,
        setNotes,
        removeNote,
    };
};
