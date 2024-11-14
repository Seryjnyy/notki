import { atom, useAtom } from "jotai";
import { useCallback } from "react";

type SortOrder = "asc" | "desc";
type SortBy = "time" | "title" | "size" | "characterCount";

const sortOrderDefault: SortOrder = "asc";
const sortByDefault: SortBy = "time";

const searchTermAtom = atom("");
const sortOrderAtom = atom<SortOrder>(sortOrderDefault);
const sortByAtom = atom<SortBy>(sortByDefault);

export default function useFilterAndSortSettings() {
    const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
    const [sortBy, setSortBy] = useAtom(sortByAtom);
    const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);

    const resetSearchTerm = useCallback(
        () => setSearchTerm(""),
        [setSearchTerm]
    );
    const resetSortBy = useCallback(
        () => setSortBy(sortByDefault),
        [setSortBy]
    );
    const resetSortOrder = useCallback(
        () => setSortOrder(sortOrderDefault),
        [setSortOrder]
    );

    const reset = useCallback(() => {
        resetSearchTerm();
        resetSortBy();
        resetSortOrder();
    }, [resetSearchTerm, resetSortBy, resetSortOrder]);

    return {
        searchTerm,
        sortBy,
        sortOrder,
        setSortOrder,
        setSearchTerm,
        setSortBy,
        reset,
        resetSearchTerm,
        resetSortBy,
        resetSortOrder,
    };
}
