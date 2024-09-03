import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/tooltip";

import { ReactNode, useEffect, useState } from "react";
import { getAllFilesInFolderWithMetadata } from "~/lib/file-services/directory-service";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
    ArchiveIcon,
    CardStackPlusIcon,
    CaretDownIcon,
    CaretRightIcon,
    CaretSortIcon,
    CubeIcon,
    FileIcon,
    FilePlusIcon,
    MixerVerticalIcon,
    PlusIcon,
    ReloadIcon,
    ResetIcon,
} from "@radix-ui/react-icons";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { produce } from "immer";
import {
    changeStoredCurrentTab,
    changeStoredOpenedTabs,
} from "~/lib/file-services/tab-service";
import { Button } from "@repo/ui/button";
import { ScrollArea } from "@repo/ui/scroll-area";
import { FileEntryWithMetadata } from "~/lib/file-services/file-service";
import { useUiState } from "~/lib/ui-store";
import { useWorkspaceConfig } from "~/lib/workspace-store";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@repo/ui/context-menu";

const File = ({ data }: { data: FileEntryWithMetadata }) => {
    const currentTab = useOpenedTabs((state) => state.currentTabId);
    const setCurrentTab = useOpenedTabs((state) => state.setCurrentTabId);
    const openedTabs = useOpenedTabs((state) => state.openedTabs);
    const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);
    const uiState = useUiState((state) => state.uiState);

    const bgColour = currentTab == data.id ? "bg-secondary" : "";

    const onClick = () => {
        console.log(data.metadata);
        if (uiState.section != "note-manager") return;

        setCurrentTab(data.id);
        changeStoredCurrentTab(data.id);

        // Only add once
        if (openedTabs.find((tab) => tab.id == data.id) == undefined) {
            setOpenedTabs(
                produce(openedTabs, (draft) => {
                    draft.push({
                        id: data.id,
                        filepath: data.path,
                        title: data.name ?? "unknown",
                        workspaceId: "no workspace id",
                    });
                })
            );
            console.log("opened tabs", openedTabs);
            changeStoredOpenedTabs(openedTabs);
        }
    };

    return (
        // <Tooltip delayDuration={2000}>
        //     <TooltipTrigger>
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    className={`px-2 hover:bg-secondary ${bgColour} rounded-none text-start `}
                    onClick={onClick}
                >
                    <span className="text-ellipsis text-nowrap flex items-center gap-1">
                        <FileIcon className="text-muted-foreground" />{" "}
                        {data.name}
                    </span>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-background w-[19rem]">
                <ContextMenuItem className="hover:bg-secondary hover:text-secondary-foreground px-6 w-full py-2 font-semibold">
                    Some stuff
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
        // </TooltipTrigger>
        //     <TooltipContent className="flex flex-col px-4" side="bottom">
        //         <p>
        //             modified at{" "}
        //             <span className="font-semibold">
        //                 {data.metadata.modifiedAt.toDateString()}
        //             </span>
        //         </p>
        //         <p>
        //             created at{" "}
        //             <span className="font-semibold">
        //                 {data.metadata.createdAt.toDateString()}
        //             </span>
        //         </p>
        //     </TooltipContent>
        // </Tooltip>
    );
};

const Folder = ({ data }: { data: FileEntryWithMetadata }) => {
    // TODO : ui state should store which one is open
    const [open, setOpen] = useState(false);

    return (
        <Collapsible open={open} className="w-full">
            <CollapsibleTrigger
                className="px-2 w-full hover:bg-secondary rounded-none text-start flex items-center "
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            >
                {open && <CaretDownIcon />}
                {!open && <CaretRightIcon />}
                <span className="flex gap-1 items-center">
                    <ArchiveIcon className="text-muted-foreground" />
                    {data.name}
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col ml-4  border-l border-muted">
                {data.children &&
                    data.children.map((file, index) => {
                        if (file.children) {
                            return <Folder data={file} key={index} />;
                        }

                        return <File data={file} key={index} />;
                    })}
            </CollapsibleContent>
        </Collapsible>
    );
};

const FileExplorerTooltip = ({
    trigger,
    content,
}: {
    trigger: ReactNode;
    content: ReactNode;
}) => {
    return (
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default function FileExplorer() {
    const [files, setFiles] = useState<FileEntryWithMetadata[]>([]);
    const [open, setOpen] = useState(true);
    const workspace = useWorkspaceConfig((state) => state.currentWorkspace);

    useEffect(() => {
        const setUp = async () => {
            if (!workspace) return;

            const res = await getAllFilesInFolderWithMetadata(
                workspace.filepath
            );
            console.log(res);
            setFiles(res);
        };
        setUp();
    }, []);

    const onReload = async () => {
        if (!workspace) return;
        const res = await getAllFilesInFolderWithMetadata(workspace.filepath);

        setFiles(res);
    };

    return (
        <div className="h-full flex flex-col border-r">
            <div className="py-2 w-full flex items-center justify-center  bg-inherit brightness-125">
                <FileExplorerTooltip
                    trigger={
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            onClick={onReload}
                        >
                            <ReloadIcon />
                        </Button>
                    }
                    content="Reload folder"
                />
                <FileExplorerTooltip
                    trigger={
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            onClick={() => {}}
                        >
                            <FilePlusIcon />
                        </Button>
                    }
                    content="Create file"
                />

                <FileExplorerTooltip
                    trigger={
                        <Button size={"icon"} variant={"ghost"}>
                            <CardStackPlusIcon />
                        </Button>
                    }
                    content="Create folder"
                />
                <FileExplorerTooltip
                    trigger={
                        <Button size={"icon"} variant={"ghost"}>
                            <MixerVerticalIcon />
                        </Button>
                    }
                    content="Sort"
                />
                <FileExplorerTooltip
                    trigger={
                        <Button variant={"ghost"} size={"icon"}>
                            <CaretSortIcon />
                        </Button>
                    }
                    content="Collapse all"
                />
            </div>

            <ScrollArea className="h-[90vh]">
                <div className="text-center text-sm text-muted-foreground py-2">
                    {workspace?.name}
                </div>
                <Collapsible open={open}>
                    <CollapsibleTrigger
                        className="px-2 w-full hover:bg-secondary rounded-none text-start flex items-center "
                        onClick={() => {
                            setOpen((prev) => !prev);
                        }}
                    >
                        {open && <CaretDownIcon />}
                        {!open && <CaretRightIcon />}
                        <span className="flex items-center gap-1 ">
                            <CubeIcon className="text-muted-foreground" />
                            {workspace?.filepath}
                        </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex  ">
                        <div className="flex flex-col px-0    ml-4 border-l border-muted w-full">
                            {files
                                .sort((file) => (file.children ? -1 : 1))
                                .map((file, index) => {
                                    if (file.children) {
                                        return (
                                            <Folder data={file} key={index} />
                                        );
                                    }

                                    return <File data={file} key={index} />;
                                })}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </ScrollArea>
        </div>
    );
}
