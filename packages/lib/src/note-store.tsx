import { create } from "zustand";
import { Note } from "./types";

interface NotesState {
  notes: Note[];
  setNotes: (newNotes: Note[]) => void;
  // addNote: (newNote: Note) => void;
}

const useNoteStore = create<NotesState>()((set) => ({
  notes: [],
  setNotes: (newNotes) => set(() => ({ notes: newNotes })),
  // addNote: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
}));

export { useNoteStore };
