import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import {
    EllipsisVertical,
    FolderCog2,
    FolderOpen,
    Plus,
    VaultIcon,
} from "lucide-react";
import * as React from "react";
import { Vault as VaultType } from "~/lib/backend-types";
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { ArchiveIcon } from "lucide-react";
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs";
import useVaults from "~/hooks/use-vaults";
import { showInFileExplorer } from "~/lib/file-services/directory-service";
import FolderListItem from "../landing/folder-list-item";
import { useSidebarCurrentView } from "./app-sidebar";

export default function SidebarGroupVaults() {
    const { search } = useSidebarCurrentView();
    const { vaults } = useVaults();

    const filteredVaults = React.useMemo(() => {
        return vaults.filter((item) => {
            return item.filepath.toLowerCase().includes(search.toLowerCase());
        });
    }, [vaults, search]);

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">
                <span className={search != "" ? "text-primary" : ""}>
                    Vaults
                </span>
                <span>{filteredVaults.length}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
                <SidebarMenu>
                    <VaultsList vaults={filteredVaults} />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

const VaultItem = ({ item }: { item: VaultType }) => {
    const [showTooltip, setShowTooltip] = React.useState(true);
    const uploadNoteFromDirs = useUploadNotesFromDirs();

    const openVault = (vault: VaultType) => {
        uploadNoteFromDirs({
            dirs: [vault.filepath],
            recursive: true,
            replace: true,
        });
    };

    const addNotesFromVault = (vault: VaultType) => {
        uploadNoteFromDirs({
            dirs: [vault.filepath],
            recursive: true,
            replace: false,
        });
    };

    const handleOpenInFileExplorer = (path: string) => {
        showInFileExplorer(path);
    };

    return (
        <SidebarMenuItem key={item.filepath}>
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
                                    onClick={() => openVault(item)}
                                >
                                    <FolderListItem.Title>
                                        {item.name}
                                    </FolderListItem.Title>
                                    <FolderListItem.Desc>
                                        {item.filepath}
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
                                                <VaultIcon className="size-3" />
                                                <span>{item.name}</span>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="flex items-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addNotesFromVault(item);
                                                }}
                                            >
                                                <Plus className="size-4" />
                                                <span>
                                                    Add notes from vault
                                                </span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openVault(item);
                                                }}
                                            >
                                                <FolderOpen className="size-4" />
                                                <span>Open vault</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenInFileExplorer(
                                                            item.filepath
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
                                                    }}
                                                >
                                                    <FolderCog2 className="size-4" />
                                                    <span>Manage vault</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FolderListItem.Action>
                            </div>
                        </SidebarMenuButton>
                    </TooltipTrigger>
                    {showTooltip && (
                        <TooltipContent side="bottom">
                            <p>{item.filepath}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </SidebarMenuItem>
    );
};

const VaultsList = ({ vaults }: { vaults: VaultType[] }) => {
    return vaults.map((item) => <VaultItem item={item} key={item.id} />);
};
