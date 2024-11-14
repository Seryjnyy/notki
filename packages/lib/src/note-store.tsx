import { create } from "zustand";
import { Note } from "./types";
import { createSelectors } from "./create-zustand-selectors";

interface NotesState {
    notes: Note[];
    setNotes: (newNotes: Note[]) => void;
}

const useNoteStoreBase = create<NotesState>()((set) => ({
    notes: [],
    setNotes: (newNotes) => set(() => ({ notes: newNotes })),
}));

export type SortOrder = "asc" | "desc";
export type SortBy = "time" | "title" | "size" | "characterCount";

type NoteFilterState = {
    filter: string;
    sortBy: SortBy;
    sortOrder: SortOrder;
};

interface NoteFilterActions {
    setFilter: (newFilter: string) => void;
    setSortBy: (newSortBy: SortBy) => void;
    setSortOrder: (newSortOrder: SortOrder) => void;
}

const noteFilterDefaults: NoteFilterState = {
    filter: "",
    sortBy: "time",
    sortOrder: "asc",
};

const useNoteFilterStoreBase = create<NoteFilterState & NoteFilterActions>()(
    (set) => ({
        ...noteFilterDefaults,
        setFilter: (filter) => set((state) => ({ filter: filter })),
        setSortBy: (sortBy) => set((state) => ({ sortBy: sortBy })),
        setSortOrder: (order) => set((state) => ({ sortOrder: order })),
    })
);

const useFilteredNotes = () => {
    const notes = useNoteStore((state) => state.notes);
    const filter = useNoteFilterStore((state) => state.filter);
    const sortBy = useNoteFilterStore((state) => state.sortBy);
    const sortOrder = useNoteFilterStore((state) => state.sortOrder);

    return notes
        .filter((note) => {
            if (filter) {
                return note.fileName.includes(filter);
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "time") {
                return sortOrder === "asc"
                    ? a.lastModified - b.lastModified
                    : b.lastModified - a.lastModified;
            } else if (sortBy === "title") {
                return sortOrder === "asc"
                    ? a.fileName.localeCompare(b.fileName)
                    : b.fileName.localeCompare(a.fileName);
            } else if (sortBy === "size") {
                return sortOrder === "asc" ? a.size - b.size : b.size - a.size;
            } else {
                return sortOrder === "asc"
                    ? a.characterCount - b.characterCount
                    : b.characterCount - a.characterCount;
            }
        });
};

const useNoteFilterStore = createSelectors(useNoteFilterStoreBase);
const useNoteStore = createSelectors(useNoteStoreBase);

export { useNoteStore, useNoteFilterStore, useFilteredNotes };
