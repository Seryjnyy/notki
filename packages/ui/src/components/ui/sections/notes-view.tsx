import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { sortNotes } from "@repo/lib/note-sorting";
import { useNoteStore } from "@repo/lib/note-store";
import { usePreferenceStore } from "@repo/lib/preference-store";
import { useSearch } from "@repo/lib/search-store";
import { Note, NoteSettings } from "@repo/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../button";
import NoteCard from "../note-card";

export default function NotesView() {
    const notes = useNoteStore((state) => state.notes);
    const setNotes = useNoteStore((state) => state.setNotes);
    const searchTerm = useSearch((state) => state.searchTerm);
    const setSearchResultCount = useSearch((state) => state.setResultCount);
    const searchTarget = useSearch((state) => state.searchTarget);
    const settings = usePreferenceStore((state) => state.settings);

    let content = <></>;

    const handleDelete = (id: string) => {
        setNotes(notes.filter((note) => note.id != id));
    };

    const filterSearch = () => {
        if (searchTerm == "") return [...notes];

        let filtered: Note[] = [];

        switch (searchTarget) {
            case "content":
                filtered = notes.filter((note) =>
                    note.content.includes(searchTerm)
                );
                break;
            case "title":
                filtered = notes.filter((note) =>
                    note.fileName.includes(searchTerm)
                );
                break;
            case "all":
                {
                    const filterSet = new Set<Note>();
                    const combined = [
                        ...notes.filter((note) =>
                            note.content.includes(searchTerm)
                        ),
                        ...notes.filter((note) =>
                            note.fileName.includes(searchTerm)
                        ),
                    ];
                    for (const note of combined) {
                        filterSet.add(note);
                    }
                    filtered = Array.from(filterSet);
                }
                break;
        }

        setSearchResultCount(filtered.length);
        return filtered;
    };

    const filteredNotes = useMemo(() => {
        return filterSearch();
    }, [notes, settings, searchTerm, searchTarget]);

    if (settings.view == "single") {
        content = (
            <SingleNote
                notes={filteredNotes}
                settings={settings}
                handleDelete={handleDelete}
            />
        );
    } else {
        const listColumns = `md:grid-cols-${settings.styling.list.columns}`;
        content = (
            <div className={"grid grid-cols-1 gap-4 " + listColumns}>
                {sortNotes(filteredNotes, settings).map((note) => (
                    <NoteCard
                        note={note}
                        key={note.id}
                        settings={settings}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className="px-2"
            style={{
                paddingLeft: `${settings.styling.list.paddingX}rem`,
                paddingRight: `${settings.styling.list.paddingX}rem`,
            }}
        >
            {content}
        </div>
    );
}

interface SingleNoteProps {
    notes: Note[];
    settings: NoteSettings;
    handleDelete: (id: string) => void;
}
const SingleNote = ({ notes, settings, handleDelete }: SingleNoteProps) => {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((prev) => {
            if (prev + 1 < notes.length) return prev + 1;

            return prev;
        });
    };

    const handlePrev = () => {
        setIndex((prev) => {
            if (prev - 1 >= 0) return prev - 1;

            return prev;
        });
    };

    useEffect(() => {
        // new notes
        // note has been removed
        let tempIndex = index;
        while (tempIndex >= notes.length) {
            tempIndex -= 1;
        }
        setIndex(tempIndex);

        if (notes.length == 0) {
            setIndex(0);
        }
    }, [notes]);

    useEffect(() => {
        const keyListener = (e: globalThis.KeyboardEvent) => {
            if (e.key == "ArrowLeft") {
                handlePrev();
            } else if (e.key == "ArrowRight") {
                handleNext();
            }
        };

        document.addEventListener("keydown", keyListener);

        return () => {
            document.removeEventListener("keydown", keyListener);
        };
    }, []);

    const onDelete = (id: string) => {
        handleDelete(id);
        console.log(index, notes.length);
        while (index > notes.length - 1) {
            setIndex(0);
            // handlePrev();
            console.log(index);
        }
    };

    console.log(notes[0]);

    return (
        <div>
            {notes.length > 0 && notes[index] && notes[index].id && (
                <NoteCard
                    note={notes[index]}
                    key={notes[index].id}
                    settings={settings}
                    handleDelete={onDelete}
                />
            )}
            <div className="flex justify-center items-center gap-2 fixed bottom-2 left-0 right-0 mx-auto w-fit p-1 backdrop-blur-md rounded-lg">
                <Button
                    variant={"outline"}
                    onClick={handlePrev}
                    disabled={index == 0}
                >
                    <ArrowLeftIcon />
                </Button>
                <span className="text-sm text-muted-foreground">{`${
                    notes.length == 0 ? 0 : index + 1
                }/${notes.length}`}</span>
                <Button
                    variant={"outline"}
                    onClick={handleNext}
                    disabled={index + 1 >= notes.length}
                >
                    <ArrowRightIcon />
                </Button>
            </div>
        </div>
    );
};
