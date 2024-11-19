import { ResetButton } from "@repo/ui/components/settings/reset-button";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Label } from "@repo/ui/components/ui/label";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { open } from "@tauri-apps/api/dialog";
import {
    ArchiveIcon,
    DoorOpen,
    EllipsisVertical,
    Infinity,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs";
import { showInFileExplorer } from "~/lib/file-services/directory-service";
import { useOpenFolderSettingsStore } from "~/stores/open-folder-settings-store";
import {
    Recent,
    useGetSortedRecents,
    useRecentsStore,
} from "~/stores/recents-store";
import LandingCard from "./landing-card";
import FolderListItem from "./folder-list-item";

export default function Recents() {
    const clearRecents = useRecentsStore.use.clearRecents();

    return (
        <LandingCard>
            <LandingCard.Title
                secondary={<ResetButton onClick={clearRecents} />}
            >
                Recents
            </LandingCard.Title>
            <LandingCard.Content>
                <ScrollArea className="h-[calc(100vh-18rem)] pr-3 ">
                    <ul className="pt-4 flex flex-col gap-2">
                        <RecentsList />
                    </ul>
                </ScrollArea>
            </LandingCard.Content>
            <LandingCard.Footer>
                <OpenFolder />
            </LandingCard.Footer>
        </LandingCard>
    );
}

const OpenFolder = () => {
    const { addRecent } = useRecentsStore();
    const recursive = useOpenFolderSettingsStore.use.recursive();
    const setRecursive = useOpenFolderSettingsStore.use.setRecursive();

    const multiple = useOpenFolderSettingsStore.use.multiple();
    const setMultiple = useOpenFolderSettingsStore.use.setMultiple();

    const uploadNotesFromDirs = useUploadNotesFromDirs();

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

        await uploadNotesFromDirs({
            dirs: paths,
            recursive,
        });

        paths.forEach((path) => addRecent(path, recursive));
    };

    // TODO : needs loader, spinner maybe
    return (
        <div className="flex  flex-col">
            <div className="w-[10rem]">
                <Button onClick={() => onBrowse()}>
                    <DoorOpen /> Open folder{multiple ? "s" : ""}
                </Button>
            </div>

            <div className="flex pt-2">
                <div className="flex items-center gap-2 px-2 ">
                    <Checkbox
                        checked={recursive}
                        onCheckedChange={(val) => {
                            if (typeof val == "boolean") setRecursive(val);
                        }}
                    />
                    <Label className="text-muted-foreground text-xs">
                        Recursive
                    </Label>
                </div>
                <div className="flex items-center gap-2 px-2">
                    <Checkbox
                        checked={multiple}
                        onCheckedChange={(val) => {
                            if (typeof val == "boolean") setMultiple(val);
                        }}
                    />
                    <Label className="text-muted-foreground text-xs">
                        Multiple
                    </Label>
                </div>
            </div>
        </div>
    );
};

// TODO : not sure about permissions here ibh, this might only work during a session, then will need to allow again
// unless reads are find, but i doubt it. Last resort can be the tauri persisted permission thingy
const RecentsList = () => {
    const recents = useGetSortedRecents();
    const uploadNotesFromDirs = useUploadNotesFromDirs();
    const addRecent = useRecentsStore.use.addRecent();
    const removeRecent = useRecentsStore.use.removeRecent();
    // TODO : slightly annoying tooltip :/
    // After using dropdown menu and closing it the tooltip stays open
    // showTooltip is used to stop it from showing when dropdown is open, but doesn't fix the above problem
    const [showTooltip, setShowTooltip] = useState(true);

    const onOpenInFileExplorer = async (path: string) => {
        showInFileExplorer(path);
    };

    const handleOpenRecent = async (recent: Recent) => {
        // TODO : This part is repeated throughout the app, should be a single function
        // to ensure that both are done together
        // TODO : Should be checking if things were successful
        await uploadNotesFromDirs({
            dirs: recent.path,
            recursive: recent.recursive,
        });
        addRecent(recent.path, recent.recursive);
    };

    return recents.map((recent) => (
        <li key={recent.path}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <FolderListItem
                            onClick={() => handleOpenRecent(recent)}
                        >
                            <FolderListItem.Header>
                                <FolderListItem.Title>
                                    {recent.recursive && (
                                        <span className="border-r pr-1">
                                            <Infinity className="size-3" />
                                        </span>
                                    )}
                                    {/* TODO : this might only work on windows no??? are filepaths read in the same way regardless of OS?*/}
                                    {recent.path.split("\\").pop()}
                                </FolderListItem.Title>
                                <FolderListItem.Desc>
                                    {recent.path}
                                </FolderListItem.Desc>
                            </FolderListItem.Header>

                            <FolderListItem.Action>
                                <DropdownMenu
                                    onOpenChange={(val) => setShowTooltip(!val)}
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
                                        <DropdownMenuItem
                                            className="flex items-center gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenInFileExplorer(
                                                    recent.path
                                                );
                                            }}
                                        >
                                            <ArchiveIcon className="size-4" />
                                            <span>Reveal in file explorer</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="flex items-center gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecent(recent.path);
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                            <span>Remove recent</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </FolderListItem.Action>
                        </FolderListItem>
                    </TooltipTrigger>
                    {showTooltip && (
                        <TooltipContent side="bottom">
                            <p>{recent.path}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </li>
    ));
};
