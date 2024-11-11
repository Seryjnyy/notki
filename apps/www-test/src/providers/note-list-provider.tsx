import { Note } from "@repo/lib/types";
import {
    createContext,
    createRef,
    RefObject,
    useContext,
    useRef,
    useState,
} from "react";
import { useNotes } from "~/hooks/use-notes";

type NoteListContextType = {
    notes: Note[];
    itemsRef: RefObject<Map<string, RefObject<HTMLLIElement>>>;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    getRef: (id: string) => RefObject<HTMLLIElement>;
};

const NoteListContext = createContext<NoteListContextType | null>(null);

export const NoteListProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { notes } = useNotes();
    const itemsRef = useRef(new Map());
    const [activeIndex, setActiveIndex] = useState(0);

    const getRef = (id: string) => {
        if (!itemsRef.current.has(id)) {
            itemsRef.current.set(id, createRef());
        }
        return itemsRef.current.get(id);
    };

    return (
        <NoteListContext.Provider
            value={{ notes, itemsRef, activeIndex, setActiveIndex, getRef }}
        >
            {children}
        </NoteListContext.Provider>
    );
};

export const useNoteList = () => {
    const context = useContext(NoteListContext);

    if (!context) {
        throw new Error("useNoteList must be used within a NoteListProvider");
    }

    return context;
};
