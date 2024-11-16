import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { Circle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import NoteCard from "./components/compound-ui/note-card";
import { ThemeSwitcherList } from "./components/theme-switcher-list";
import { useNotes } from "./hooks/use-notes";
import { cn } from "./lib/utils";

import { ReactNode, useCallback } from "react";
import FixedBottomNavBar from "./components/navbar/fixed-bottom-bar";
import SkipToNavLink from "./components/skip-to-nav-link";
import SomethingWentWrong from "./components/something-went-wrong";
import { NoteListProvider, useNoteList } from "./providers/note-list-provider";
import { StyleProvider } from "./providers/style-provider";
import { useNoteDisplaySettings } from "./stores/note-display-settings-store";

function App() {
    return (
        <>
            <StyleProvider />
            <Main />
            <Toaster />
        </>
    );
}

const Main = () => {
    const { notes } = useNotes();
    const hasNotes = notes.length > 0;

    return (
        <main className="bg-background ">
            <header className="pt-4">
                <h1 className="sr-only">Txt viewer</h1>
            </header>

            {!hasNotes && (
                <section className="w-3/4 mx-auto">
                    <h2 className="text-muted-foreground text-center text-sm">
                        ADD TXT FILES
                    </h2>
                    <div
                        className={cn(
                            " py-2",
                            !hasNotes ? "h-[80vh]" : "h-[10rem]"
                        )}
                    >
                        <DropZone />
                    </div>

                    <div className="">
                        <ThemeSwitcherList />
                    </div>
                </section>
            )}

            {hasNotes && (
                <section className="w-full h-fit  pt-4 mt-4 ">
                    <SkipToNavLink />
                    <h2 className="text-muted-foreground text-center text-sm">
                        YOUR NOTES
                    </h2>
                    <ErrorBoundary fallback={<SomethingWentWrong />}>
                        <NoteListProvider>
                            <div className="mb-40 sm:mb-16 ">
                                <Notes />
                            </div>
                            <FixedBottomNavBar />
                        </NoteListProvider>
                    </ErrorBoundary>
                </section>
            )}
        </main>
    );
};

const NotesList = ({ children }: { children: ReactNode }) => {
    const cols = useNoteDisplaySettings.use.cols();
    const colsGap = useNoteDisplaySettings.use.colsGap();
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();

    return (
        <ul
            className="grid"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: `${colsGap}px`,
                padding: `${paddingY}px ${paddingX}px`,
            }}
        >
            {children}
        </ul>
    );
};

const SingleNote = ({
    removeNote,
}: {
    removeNote: (noteID: string) => void;
}) => {
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
};

const Notes = () => {
    const { removeNote } = useNotes(); // TODO : useNoteList context already uses this hook, should it get it from there?
    const { notes, activeIndex, setActiveIndex, getRef } = useNoteList();
    const display = useNoteDisplaySettings.use.display();

    if (display === "slideshow") return <SingleNote removeNote={removeNote} />;

    // TODO : rerenders everything every time notes are navigated, could be a issue with lots of notes
    // TODO : should this be virtualized?
    return (
        <NotesList>
            {notes.map((note, index) => (
                <li
                    key={note.id}
                    ref={getRef(note.id)}
                    onClick={() => setActiveIndex(index)}
                    className={`relative`}
                >
                    <NoteCard note={note} onDelete={removeNote} />
                    {index === activeIndex && (
                        <div className="absolute bottom-2  right-2">
                            {/* <Circle className="size-3 text-primary" /> */}
                            <div className="size-3 border-2 border-primary rounded-[var(--radius)]"></div>
                        </div>
                    )}
                </li>
            ))}
        </NotesList>
    );
};

export default App;
