import { ExclamationTriangleIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { Circle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import NoteCard from "./components/compound-ui/note-card";
import { ThemeSwitcherList } from "./components/theme-switcher-list";
import { useNotes } from "./hooks/use-notes";
import { cn } from "./lib/utils";

import SkipToNavLink from "./components/skip-to-nav-link";
import NoteNav from "./components/toolbar/note-nav";
import Toolbar from "./components/toolbar/toolbar";
import { NoteListProvider, useNoteList } from "./providers/note-list-provider";

function App() {
    return (
        <>
            <TooltipProvider>
                <Main />
            </TooltipProvider>
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

                    <ErrorBoundary
                        fallback={
                            <div className="flex flex-col gap-4 pt-8 px-8">
                                <Alert variant="destructive">
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                    <AlertTitle>
                                        Something went wrong
                                    </AlertTitle>
                                    <AlertDescription>
                                        Refresh the page, if error persists try
                                        resetting <br />
                                        preferences. If nothing works please let
                                        me know.
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    className="space-x-2"
                                    // onClick={onResetPreferences}
                                >
                                    <span>Reset preferences</span>{" "}
                                    <UpdateIcon />
                                </Button>
                            </div>
                        }
                    >
                        <NoteListProvider>
                            <Notes />
                            <BottomToolbarAndNav />
                        </NoteListProvider>
                    </ErrorBoundary>
                </section>
            )}
        </main>
    );
};

const BottomToolbarAndNav = () => {
    return (
        <div
            className="bottom-0 fixed left-0 w-full  flex justify-between "
            id="main-nav"
            tabIndex={-1}
        >
            <div className="backdrop-blur-md rounded-tr-[var(--radius)] border-t border-r p-2 w-fit">
                <NoteNav />
            </div>
            <div className="z-50 backdrop-blur-md p-2 border-t border-l rounded-tl-[var(--radius)] w-fit">
                <Toolbar />
            </div>
        </div>
    );
};

const Notes = () => {
    const { removeNote } = useNotes(); // TODO : useNoteList context already uses this hook, should it get it from there?
    const { notes, activeIndex, setActiveIndex, getRef } = useNoteList();

    // TODO : rerenders everything every time notes are navigated, could be a issue with lots of notes
    // TODO : should this be virtualized?
    return (
        <ul className="flex flex-col gap-4 px-4 mb-16">
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
                            <Circle className="size-3 text-primary" />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default App;
