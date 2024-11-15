import { useCallback } from "react";
import { useNoteStore } from "../stores/note-store";
import { useUploadSettingsStore } from "../stores/upload-file-settings-store";
import { Note } from "../types/types";

export default function useUploadNotes() {
    const replace = useUploadSettingsStore.use.replace();
    const setNotes = useNoteStore.use.setNotes();
    const notes = useNoteStore.use.notes();

    return useCallback(
        (newNotes: Note[]) => {
            if (replace) {
                setNotes([...newNotes]);
            } else {
                // don't allow duplicate content
                const newNotesFiltered = newNotes.filter((note) => {
                    return !notes.some((n) => n.content === note.content);
                });

                if (newNotesFiltered.length === 0) return;

                setNotes([...newNotesFiltered, ...notes]);
            }
        },
        [replace, setNotes, notes]
    );
}
