import { Button } from "@repo/ui/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import {
    ArchiveIcon,
    Clock,
    EllipsisVertical,
    FolderOpen,
    Plus,
    Trash2,
} from "lucide-react";
import * as React from "react";
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs";
import { showInFileExplorer } from "~/lib/file-services/directory-service";
import {
    Recent,
    useGetSortedRecents,
    useRecentsStore,
} from "~/stores/recents-store";
import FolderListItem from "../landing/folder-list-item";
import { useSidebarCurrentView } from "./app-sidebar";
import { getFolderNameFromFilepath } from "~/lib/utils";

export default function SidebarGroupRecents() {
    const { search } = useSidebarCurrentView();
    const sortedRecents = useGetSortedRecents();

    const filteredRecents = React.useMemo(() => {
        return sortedRecents.filter((item) => {
            return item.path.toLowerCase().includes(search.toLowerCase());
        });
    }, [sortedRecents, search]);

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">
                <span className={search != "" ? "text-primary" : ""}>
                    Recents
                </span>
                <span>{filteredRecents.length}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
                <SidebarMenu>
                    <RecentsList recents={filteredRecents} />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

const RecentsList = ({ recents }: { recents: Recent[] }) => {
    return recents.map((item) => <RecentItem item={item} key={item.path} />);
};

// Very similar code to the vault list item
const RecentItem = ({ item }: { item: Recent }) => {
    const [showTooltip, setShowTooltip] = React.useState(true);
    const uploadNoteFromDirs = useUploadNotesFromDirs();
    const addRecent = useRecentsStore.use.addRecent();
    const removeRecent = useRecentsStore.use.removeRecent();

    const openFolder = (recent: Recent) => {
        uploadNoteFromDirs({
            dirs: [recent.path],
            recursive: recent.recursive ?? false,
            replace: true,
        });

        // Updates recent entry to new last modified
        addRecent(recent.path, recent.recursive);
    };

    const addNotesFromFolder = (recent: Recent) => {
        uploadNoteFromDirs({
            dirs: [recent.path],
            recursive: recent.recursive ?? false,
            replace: false,
        });

        // Updates recent entry to new last modified
        addRecent(recent.path, recent.recursive);
    };

    const handleOpenInFileExplorer = (path: string) => {
        showInFileExplorer(path);
    };

    const folderName = React.useMemo(
        () => getFolderNameFromFilepath(item.path),
        [item.path]
    );
    return (
        <SidebarMenuItem key={item.path}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarMenuButton
                            isActive={false}
                            asChild
                            className="py-2 h-fit"
                        >
                            <div className="grid grid-cols-6">
                                <FolderListItem.Header
                                    onClick={() => openFolder(item)}
                                >
                                    <FolderListItem.Title>
                                        {folderName}
                                    </FolderListItem.Title>
                                    <FolderListItem.Desc>
                                        {item.path}
                                    </FolderListItem.Desc>
                                </FolderListItem.Header>

                                <FolderListItem.Action>
                                    <DropdownMenu
                                        onOpenChange={(val) =>
                                            setShowTooltip(!val)
                                        }
                                    >
                                        <div className="flex justify-end items-center">
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    variant={"ghost"}
                                                    size={"icon"}
                                                >
                                                    <EllipsisVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </div>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel className="flex items-center gap-2">
                                                <Clock className="size-3" />
                                                <span> {folderName}</span>
                                            </DropdownMenuLabel>

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="flex items-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addNotesFromFolder(item);
                                                }}
                                            >
                                                <Plus className="size-4" />
                                                <span>
                                                    Add notes from folder
                                                </span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openFolder(item);
                                                }}
                                            >
                                                <FolderOpen className="size-4" />
                                                <span>Open folder</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenInFileExplorer(
                                                            item.path
                                                        );
                                                    }}
                                                >
                                                    <ArchiveIcon className="size-4" />
                                                    <span>
                                                        Reveal in file explorer
                                                    </span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeRecent(item.path);
                                                    }}
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span>Remove recent</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                                                    {new Date(
                                                        item.lastOpened
                                                    ).toLocaleString()}
                                                </DropdownMenuLabel>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FolderListItem.Action>
                            </div>
                        </SidebarMenuButton>
                    </TooltipTrigger>
                    {showTooltip && (
                        <TooltipContent side="bottom">
                            <p>{item.path}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </SidebarMenuItem>
    );
};
