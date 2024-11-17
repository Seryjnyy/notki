import { Circle } from "lucide-react";
import NoteCard from "~/components/display-notes/note-card";

import { useCallback } from "react";
import { useNoteList } from "~/providers/note-list-provider";
import { useNoteDisplaySettings } from "~/stores/note-display-settings-store";

export default function SingleNote({
    removeNote,
}: {
    removeNote: (noteID: string) => void;
}) {
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();
    const { notes, activeIndex, setActiveIndex } = useNoteList();

    const handleRemoveNote = useCallback(
        (noteID: string) => {
            removeNote(noteID);

            if (activeIndex >= notes.length - 1) {
                setActiveIndex(activeIndex - 1);
            }
        },
        [activeIndex, notes, removeNote]
    );

    const getNote = useCallback(() => {
        if (notes.length == 0 || activeIndex < 0 || activeIndex >= notes.length)
            return null;

        const note = notes[activeIndex];
        return (
            <NoteCard note={note} key={note.id} onDelete={handleRemoveNote} />
        );
    }, [notes, activeIndex]);

    return (
        <div
            className="mb-16"
            style={{
                padding: `${paddingY}px ${paddingX}px`,
            }}
        >
            <div className="relative">
                {getNote()}
                <div className="absolute bottom-2  right-2">
                    <Circle className="size-3 text-primary" />
                </div>
            </div>
        </div>
    );
}
