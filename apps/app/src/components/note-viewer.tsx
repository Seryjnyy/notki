import { useNoteStore } from "@repo/lib/note-store";
import { Button, buttonVariants } from "@repo/ui/button";
import CopyAllContent from "@repo/ui/CopyAllContent";
import FilterAndSort from "@repo/ui/FilterAndSort";
import NotesView from "@repo/ui/notes-view";
import ResetNotes from "@repo/ui/ResetNotes";
import { ScrollArea } from "@repo/ui/scroll-area";
import Search from "@repo/ui/Search";
import Settings from "@repo/ui/Settings";
import { useEffect, useMemo, useState } from "react";
import {
    getAllFilesFolders,
    getTxtFilesWithAllDetail,
} from "~/lib/file-services/directory-service";
import { useWorkspaceConfig } from "~/lib/workspace-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog";
import { cn } from "~/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import DropZone from "@repo/ui/drop-zone";
import { Tree } from "./ui/tree";
import { FileEntry } from "@tauri-apps/api/fs";
import { Metadata } from "tauri-plugin-fs-extra-api";
import { FileEntryWithMetadata } from "~/lib/file-services/file-service";
import { PlusIcon } from "@radix-ui/react-icons";

type Item = {
    id: number;
    name: string;
    parentId: number;
};

export default function NoteViewer() {
    const setNotes = useNoteStore((state) => state.setNotes);
    const workspace = useWorkspaceConfig.use.currentWorkspace();
    const [files, setFiles] = useState<FileEntry[]>([]);

    useEffect(() => {
        (async () => {
            if (!workspace) return;
            const filesAndFolders = await getAllFilesFolders(
                workspace.filepath,
                true
            );

            setFiles(filesAndFolders);

            // setNotes(
            //     files.map((file) => {
            //         return {
            //             id: file.id,
            //             characterCount: file.content.length,
            //             content: file.content,
            //             fileName: file.name ?? "???",
            //             lastModified: file.metadata.modifiedAt.getTime(),
            //             size: file.metadata.size,
            //         };
            //     })
            // );
        })();
    }, []);

    const recursive = (
        file: FileEntry,
        parentIndex: number,
        currentIndex: number
    ) => {
        const newParentIndex = currentIndex;
        let newCurrIndex = currentIndex + 1;

        const rest: { id: number; name: string; parentId: number }[] = [
            {
                id: newParentIndex,
                name: file.name ?? "???",
                parentId: parentIndex,
            },
        ];

        if (file.children) {
            for (
                let i = 0;
                i < (file.children ? file.children?.length : 0);
                i++
            ) {
                const { data, index } = recursive(
                    file.children[i],
                    newParentIndex,
                    newCurrIndex
                );
                rest.push(...data);

                newCurrIndex = index;
            }
        }

        return { data: rest, index: newCurrIndex };
    };

    let idCounter = 0;

    function buildTreeFromFileEntries(
        entries: FileEntry[],
        parentId: number
    ): Item[] {
        const treeNodes: Item[] = [];

        entries.forEach((entry) => {
            const currentId = idCounter++; // Generate a unique ID for the current entry

            const node: Item = {
                id: currentId,
                parentId: parentId,
                name: entry.name ?? "???",
            };

            treeNodes.push(node);

            // If the entry has children, recursively process them
            if (entry.children && entry.children.length > 0) {
                const childNodes = buildTreeFromFileEntries(
                    entry.children,
                    currentId
                );
                treeNodes.push(...childNodes);
            }
        });

        return treeNodes;
    }

    const data = useMemo(() => {
        console.log(files.filter((x) => x.children == undefined));

        if (files.length == 0) return;

        // const rootFolders = files.filter((x) => x.children != undefined);
        // rootFolders.map(folder => {
        //     const iCopy = i
        //     i++;

        //     return {id:iCopy, name:folder.name ?? "???", }
        // })

        const rootFiles = files.filter((x) => x.children == undefined);
        const rootFolders = files.filter((x) => x.children != undefined);

        let index = 1;

        // const res = rootFolders.map((file) => {
        //     index++;

        //     return {
        //         id: index,
        //         name: file.name ?? "???",
        //         parentId: 1,
        //     };
        // });

        // const res2 = rootFiles.map((file) => {
        //     index++;

        //     return {
        //         id: index,
        //         name: file.name ?? "???",
        //         parentId: 1,
        //     };
        // });

        // const res = rootFiles.map((file, index) => ({
        //     id: index + 2,
        //     name: file.name ?? "???",
        //     parentId: 1,
        // }));

        // const ah = [...res, ...res2];

        // const oh: { id: number; name: string; parentId: number }[] = [];

        // let curr = 1;
        // files.forEach((file) => {
        //     const { data, index } = recursive(file, 1, curr);
        //     oh.push(...data);
        //     curr = index;
        // });

        const tree = buildTreeFromFileEntries(files, 1);
        console.log("🚀 ~ data ~ tree:", tree);
        return [
            { id: 1, name: workspace?.filepath ?? "???", parentId: 0 },
            ...tree.slice(0, 12),
        ];
    }, [files]);

    // const data = [
    //     {
    //         id: 1,
    //         name: workspace?.filepath ?? "",
    //         parentId: 0,
    //     },
    //     {
    //         id: 2,
    //         name: "Apple",
    //         parentId: 1,
    //     },
    //     {
    //         id: 3,
    //         name: "Pear",
    //         parentId: 1,
    //     },
    //     {
    //         id: 4,
    //         name: "Banana",
    //         parentId: 1,
    //     },
    //     {
    //         id: 5,
    //         name: "Countries",
    //         parentId: 1,
    //     },
    //     {
    //         id: 6,
    //         name: "Netherlands",
    //         parentId: 5,
    //     },
    //     {
    //         id: 7,
    //         name: "Scandinavia",
    //         parentId: 5,
    //     },
    //     {
    //         id: 8,
    //         name: "Denmark",
    //         parentId: 7,
    //     },
    //     {
    //         id: 9,
    //         name: "Norway",
    //         parentId: 7,
    //     },
    //     {
    //         id: 10,
    //         name: "Sweden",
    //         parentId: 7,
    //     },
    //     {
    //         id: 11,
    //         name: "Germany",
    //         parentId: 5,
    //     },
    // ];

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 md:px-8">
                <div className=" py-4">
                    <ResetNotes />
                    <Settings />
                    <FilterAndSort />
                    <Search />
                    <CopyAllContent />
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="space-x-2">
                                <PlusIcon /> <span>View notes</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="h-[70vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Open notes</DialogTitle>
                                <DialogDescription>
                                    Select some notes to view.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="h-full ">
                                <Tabs defaultValue="workspace">
                                    <TabsList>
                                        <TabsTrigger value="workspace">
                                            Workspace
                                        </TabsTrigger>
                                        <TabsTrigger value="dragndrop">
                                            Drag'n'drop
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent
                                        value="workspace"
                                        className="relative"
                                    >
                                        <Button
                                            className="absolute right-0 -top-9 border-t border-x rounded-b-none"
                                            variant={"ghost"}
                                        >
                                            Open
                                        </Button>
                                        <ScrollArea className="h-[calc(70vh-9rem)] border p-1 rounded-b-lg rounded-tl-lg">
                                            {data && <Tree data={data} />}
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="dragndrop">
                                        <DropZone />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-30px-5rem)]">
                <NotesView />
            </ScrollArea>
        </div>
    );
}
