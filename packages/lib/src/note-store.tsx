import { create } from "zustand";
import { Note } from "./types";
import { createSelectors } from "./create-zustand-selectors";

interface NotesState {
    notes: Note[];
    setNotes: (newNotes: Note[]) => void;
    // addNote: (newNote: Note) => void;
}

const useNoteStoreBase = create<NotesState>()((set) => ({
    notes: [],
    setNotes: (newNotes) => set(() => ({ notes: newNotes })),
    // addNote: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
}));

const useNoteStore = createSelectors(useNoteStoreBase);

export { useNoteStore };
