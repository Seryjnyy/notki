import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeSwitcherList } from "@repo/ui/components/theme-switcher-list";
import { useNotes } from "@repo/lib/hooks/use-notes";
import { cn } from "@repo/ui/lib/utils";

import NoteViewSwitch from "@repo/ui/components/display-notes/note-view-switch";
import FixedBottomNavBar from "@repo/ui/components/navbar/fixed-bottom-bar";
import SkipToNavLink from "@repo/ui/components/skip-to-nav-link";
import SomethingWentWrong from "@repo/ui/components/something-went-wrong";
import { NoteListProvider } from "@repo/ui/providers/note-list-provider";

export default function MainPage() {
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

                    <ThemeSwitcherList />
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
                                <NoteViewSwitch />
                            </div>
                            <FixedBottomNavBar />
                        </NoteListProvider>
                    </ErrorBoundary>
                </section>
            )}
        </main>
    );
}
