import { useNoteStore } from "@repo/lib/stores/note-store";

// TODO : Is there a need for this?
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
