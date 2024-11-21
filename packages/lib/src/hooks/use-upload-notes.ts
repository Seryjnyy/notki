import { useCallback } from "react";
import { useNoteStore } from "../stores/note-store";
import { Note } from "../types/types";

export default function useUploadNotes() {
    const setNotes = useNoteStore.use.setNotes();
    const notes = useNoteStore.use.notes();

    // Replace comes now as a parameter instead of using the store, this way its more transparent on whats going to happen when this
    // function is called
    return useCallback(
        (newNotes: Note[], replace?: boolean) => {
            if (replace === true) {
                setNotes([...newNotes]);
            } else {
                // TODO : currently this doesn't allow duplicate content
                // Maybe it would be better to not allow the same filepath, might be faster too
                // But currently filepath is not stored
                // If less notes than expected were added it will be because their content was the same
                const newNotesFiltered = newNotes.filter((note) => {
                    return !notes.some((n) => n.content === note.content);
                });

                if (newNotesFiltered.length === 0) return;

                setNotes([...newNotesFiltered, ...notes]);
            }
        },
        [setNotes, notes]
    );
}
