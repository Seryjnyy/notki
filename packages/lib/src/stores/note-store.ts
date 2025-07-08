import { create } from "zustand";
import { Note } from "../types/types";
import { createSelectors } from "../utils/create-zustand-selectors";

interface NotesState {
    notes: Note[];
    setNotes: (newNotes: Note[]) => void;
}
const useNoteStoreBase = create<NotesState>()(
    (set) => ({
        notes: [],
        setNotes: (newNotes) => set(() => ({ notes: newNotes })),
    })
    // persist(
    //     {
    //         name: "notes-storage",
    //         storage: createJSONStorage(() => sessionStorage),
    //     }
    // )
);

export type SortOrder = "asc" | "desc";
export type SortBy = "time" | "title" | "size" | "characterCount";
export type SearchIn = "title" | "content" | "both";

type NoteFilterState = {
    filter: string;
    searchIn: SearchIn;
    sortBy: SortBy;
    sortOrder: SortOrder;
};
  isRandomOrder: boolean

interface NoteFilterActions {
    setFilter: (newFilter: string) => void;
    setSortBy: (newSortBy: SortBy) => void;
    setSortOrder: (newSortOrder: SortOrder) => void;
    setSearchIn: (newSearchIn: SearchIn) => void;
  setIsRandomOrder: (newIsRandomOrder: boolean) => void
}

const noteFilterDefaults: NoteFilterState = {
    filter: "",
    searchIn: "title",
    sortBy: "time",
    sortOrder: "asc",
};
  isRandomOrder: false,

// TODO : should this store be persisted? maybe in session storage.
const useNoteFilterStoreBase = create<NoteFilterState & NoteFilterActions>()(
    (set) => ({
        ...noteFilterDefaults,
        setFilter: (filter) => set(() => ({ filter: filter })),
        setSortBy: (sortBy) => set(() => ({ sortBy: sortBy })),
        setSortOrder: (order) => set(() => ({ sortOrder: order })),
        setSearchIn: (searchIn) => set(() => ({ searchIn: searchIn })),
    })
);
    setIsRandomOrder: (isRandomOrder) =>
      set(() => ({ isRandomOrder: isRandomOrder })),
  })

// TODO : Idk if this is considered best practice, its a normal hook but is okay?
const useFilteredNotes = () => {
    const notes = useNoteStore.use.notes();
    const filter = useNoteFilterStore.use.filter();
    const sortBy = useNoteFilterStore.use.sortBy();
    const sortOrder = useNoteFilterStore.use.sortOrder();
    const searchIn = useNoteFilterStore.use.searchIn();
  const isRandomOrder = useNoteFilterStore.use.isRandomOrder()

  if (isRandomOrder) {
    return shuffle<Note>(notes)
  }

    return notes
        .filter((note) => {
            if (filter) {
                if (searchIn === "title") {
                    return note.fileName.includes(filter);
                } else if (searchIn === "content") {
                    return note.content.includes(filter);
                } else {
                    return (
                        note.fileName.includes(filter) ||
                        note.content.includes(filter)
                    );
                }
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

export { useFilteredNotes, useNoteFilterStore, useNoteStore };
