import { create } from "zustand";

interface NotesState {
  notes: Note[];
  setNotes: (newNotes: Note[]) => void;
  addNote: (newNote: Note) => void;
}

const useNoteStore = create<NotesState>()((set) => ({
  notes: [],
  setNotes: (newNotes) => set((_) => ({ notes: newNotes })),
  addNote: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
}));

export { useNoteStore };
