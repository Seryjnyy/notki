import { useNoteStore } from "@repo/lib/note-store";

export const useNotes = () => {
    const notes = useNoteStore.use.notes();
    const setNotes = useNoteStore.use.setNotes();

    const addNote = (note: any) => {
        setNotes([...notes, note]);
    };

    const removeNote = (noteId: string) => {
        setNotes(notes.filter((note: any) => note.id !== noteId));
    };

    return {
        notes,
        addNote,
        setNotes,
        removeNote,
    };
};
