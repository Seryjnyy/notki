import { useNotes } from "@repo/lib/hooks/use-notes";
import { ThemeSwitcherList } from "@repo/ui/components/theme-switcher-list";
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { cn } from "@repo/ui/lib/utils";
import { ErrorBoundary } from "react-error-boundary";

import useUploadNotes from "@repo/lib/hooks/use-upload-notes";
import { guidGenerator } from "@repo/lib/utils/metadata-utils";
import NoteViewSwitch from "@repo/ui/components/display-notes/note-view-switch";
import FixedBottomNavBar from "@repo/ui/components/navbar/fixed-bottom-bar";
import SkipToNavLink from "@repo/ui/components/skip-to-nav-link";
import SomethingWentWrong from "@repo/ui/components/something-went-wrong";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { NoteListProvider } from "@repo/ui/providers/note-list-provider";
import { open } from "@tauri-apps/api/dialog";
import { DoorOpen } from "lucide-react";
import { useState } from "react";
import { getTxtFilesWithAllDetail } from "~/lib/file-services/directory-service";

const OpenFolder = () => {
    const [recursive, setRecursive] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const uploadNotes = useUploadNotes();

    const onBrowse = async () => {
        const selected = await open({
            directory: true,
            multiple: multiple,
            recursive: recursive,
        });

        if (selected === null) {
            console.error("Nothing selected.");
            return;
        }

        const paths = Array.isArray(selected) ? selected : [selected];

        const txtFiles = await Promise.all(
            paths.map((path) => getTxtFilesWithAllDetail(path, recursive))
        ).then((res) => res.flat());

        const readInNotes = txtFiles.map((file) => ({
            id: guidGenerator(),
            fileName: file.name ?? "???",
            content: file.content,
            size: file.metadata.size,
            lastModified: file.metadata.modifiedAt.getTime(),
            characterCount: file.content.length,
        }));

        uploadNotes(readInNotes);
    };

    // TODO : needs loader, spinner
    return (
        <div className="space-y-2 w-[10rem] ">
            <Button onClick={() => onBrowse()}>
                <DoorOpen /> Open folder{multiple ? "s" : ""}
            </Button>
            <div className="flex items-center gap-2 px-2">
                <Checkbox
                    checked={recursive}
                    onCheckedChange={(val) => {
                        if (typeof val == "boolean") setRecursive(val);
                    }}
                />
                <Label className="text-muted-foreground">Recursive</Label>
            </div>
            <div className="flex items-center gap-2 px-2">
                <Checkbox
                    checked={multiple}
                    onCheckedChange={(val) => {
                        if (typeof val == "boolean") setMultiple(val);
                    }}
                />
                <Label className="text-muted-foreground">Multiple</Label>
            </div>
        </div>
    );
};

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
                        className={cn(" py-2 grid grid-cols-2 h-[80vh] gap-3")}
                    >
                        <DropZone />
                        <div className="w-full border rounded-[var(--radius)] flex justify-center items-center">
                            <OpenFolder />
                        </div>
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
