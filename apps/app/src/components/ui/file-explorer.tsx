import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

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
    ReloadIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@repo/ui/components/ui/context-menu";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { ReactNode, useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { getAllFilesFoldersWithMetadata } from "~/lib/file-services/directory-service";
import {
    FileEntryWithMetadata,
    newDir,
    newFile,
} from "~/lib/file-services/file-service";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { useWorkspaceConfig } from "~/lib/workspace-store";

const File = ({ data }: { data: FileEntryWithMetadata }) => {
    const currentTab = useOpenedTabs.use.currentTabId();
    const setCurrentTab = useOpenedTabs.use.setCurrentTabId();
    const addOpenTab = useOpenedTabs.use.addOpenTab();
    const workspace = useWorkspaceConfig.use.currentWorkspace();

    const bgColour = currentTab == data.id ? "bg-secondary" : "";

    const onClick = () => {
        addOpenTab({
            id: data.id,
            filepath: data.path,
            title: data.name ?? "???",
            workspaceId: workspace!.id,
        });
        setCurrentTab(data.id);
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={1000}>
                <TooltipTrigger>
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <div
                                className={`px-2 hover:bg-secondary/50 ${bgColour} rounded-none text-start `}
                                onClick={onClick}
                            >
                                <span className="text-ellipsis text-nowrap flex items-center gap-1">
                                    <FileIcon className="text-muted-foreground" />{" "}
                                    {data.name}
                                </span>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-[13rem]">
                            <ContextMenuItem
                                disabled
                                className="hover:bg-secondary hover:text-secondary-foreground px-3 w-full py-1 space-x-2"
                                // onClick={() => {
                                //     deleteFile(data.path);
                                // }}
                            >
                                <span className="flex  gap-2 text-destructive">
                                    <TrashIcon /> Delete
                                </span>
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </TooltipTrigger>
                <TooltipContent
                    className="flex flex-col px-4"
                    side="right"
                    sideOffset={20}
                >
                    <TooltipArrow className="text-white" />
                    <p>
                        modified at{" "}
                        <span className="font-semibold">
                            {data.metadata.modifiedAt.toDateString()}
                        </span>
                    </p>
                    <p>
                        created at{" "}
                        <span className="font-semibold">
                            {data.metadata.createdAt.toDateString()}
                        </span>
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const Folder = ({ data }: { data: FileEntryWithMetadata }) => {
    // TODO : ui state should store which one is open
    const [open, setOpen] = useState(false);

    const onNewFile = () => {
        newFile(data.path);
    };

    const onNewDir = () => {
        newDir(data.path);
    };

    return (
        <Collapsible open={open} className="w-full">
            <TooltipProvider>
                <Tooltip delayDuration={1000}>
                    <TooltipTrigger asChild>
                        <CollapsibleTrigger
                            className="px-2 w-full hover:bg-secondary/50 rounded-none "
                            onClick={() => {
                                setOpen((prev) => !prev);
                            }}
                        >
                            <ContextMenu>
                                <ContextMenuTrigger className=" flex items-center text-start ">
                                    {open && <CaretDownIcon />}
                                    {!open && <CaretRightIcon />}
                                    <span className="flex gap-1 items-center">
                                        <ArchiveIcon className="text-muted-foreground" />
                                        <span className="overflow-hidden text-ellipsis text-nowrap">
                                            {data.name}
                                        </span>
                                    </span>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="bg-background w-[13rem]">
                                    <ContextMenuItem
                                        className="hover:bg-secondary hover:text-secondary-foreground px-3 w-full py-1  space-x-2"
                                        onClick={onNewFile}
                                    >
                                        <FilePlusIcon /> <span>New file</span>
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                        className="hover:bg-secondary hover:text-secondary-foreground px-3 w-full py-1 space-x-2"
                                        onClick={onNewDir}
                                    >
                                        <CardStackPlusIcon />{" "}
                                        <span>New folder</span>
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                        disabled
                                        className="hover:bg-secondary hover:text-secondary-foreground px-3 w-full py-2  space-x-2 "
                                    >
                                        <span className="flex  gap-2 text-destructive">
                                            <TrashIcon /> Delete
                                        </span>
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                        className="flex flex-col px-4"
                        side="right"
                        sideOffset={20}
                    >
                        <TooltipArrow className="text-white" />
                        {/* TODO : This is counting folders as files */}
                        <p className="flex gap-1 items-center">
                            <span className="font-semibold">
                                {data.children ? data.children.length : 0}
                            </span>
                            <span>files</span>
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

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
        <Tooltip delayDuration={300}>
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

            const res = await getAllFilesFoldersWithMetadata(
                workspace.filepath,
                true
            );
            console.log(res);
            setFiles(res);
        };
        setUp();
    }, []);

    const onReload = async () => {
        if (!workspace) return;
        const res = await getAllFilesFoldersWithMetadata(
            workspace.filepath,
            true
        );

        setFiles(res);
    };

    const onNewFile = () => {
        if (!workspace) return;

        newFile(workspace?.filepath);
    };

    return (
        <div className="h-full flex flex-col  mr-1">
            <div className="py-2 w-full flex items-center justify-center  bg-inherit brightness-125 border-b border-secondary">
                <TooltipProvider>
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
                                onClick={onNewFile}
                            >
                                <FilePlusIcon />
                            </Button>
                        }
                        content="Create file"
                    />

                    <FileExplorerTooltip
                        trigger={
                            <Button
                                size={"icon"}
                                variant={"ghost"}
                                onClick={() =>
                                    newDir(workspace?.filepath ?? "")
                                }
                            >
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
                </TooltipProvider>
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
