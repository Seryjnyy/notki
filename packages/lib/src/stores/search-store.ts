import { create } from "zustand";
import { SearchTarget } from "../types/types";

// TODO : this will soon be deprecated when app is updated to new www-test stuff
// search is now done in useNoteFilterStore in note-store file

interface SearchStore {
    searchTerm: string;
    resultCount: number;
    searchTarget: SearchTarget;
    setSearchTerm: (newTerm: string) => void;
    setResultCount: (newCount: number) => void;
    setSearchTarget: (newTarget: SearchTarget) => void;
}

const useSearch = create<SearchStore>()((set) => ({
    searchTerm: "",
    setSearchTerm: (newTerm) => set(() => ({ searchTerm: newTerm })),
    resultCount: 0,
    setResultCount: (newCount) => set(() => ({ resultCount: newCount })),
    searchTarget: "content",
    setSearchTarget: (newTarget) => set(() => ({ searchTarget: newTarget })),
}));

export { useSearch };
