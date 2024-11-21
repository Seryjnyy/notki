import { Button } from "@repo/ui/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { ArchiveIcon, EllipsisVertical, PlusIcon } from "lucide-react";
import { useState } from "react";
import useVaults from "~/hooks/use-vaults";
import { showInFileExplorer } from "~/lib/file-services/directory-service";
import FolderListItem from "./folder-list-item";
import LandingCard from "./landing-card";

export default function Vaults() {
    return (
        <LandingCard>
            <LandingCard.Title
                secondary={
                    <Button size={"icon"} variant={"ghost"}>
                        <EllipsisVertical className="size-4" />
                    </Button>
                }
            >
                Existing txt files
            </LandingCard.Title>
            <LandingCard.Content>
                <ScrollArea className="h-[calc(100vh-18rem)] pr-3 ">
                    <ul className="pt-4 flex flex-col gap-2">
                        <ExistingVaultsList />
                    </ul>
                </ScrollArea>
            </LandingCard.Content>
            <LandingCard.Footer>
                <Button>
                    <PlusIcon /> Add vault
                </Button>
            </LandingCard.Footer>
        </LandingCard>
    );
}

const ExistingVaultsList = () => {
    const { vaults } = useVaults();
    // TODO : slightly annoying tooltip :/
    // After using dropdown menu and closing it the tooltip stays open
    // showTooltip is used to stop it from showing when dropdown is open, but doesn't fix the above problem
    const [showTooltip, setShowTooltip] = useState(true);

    const onOpenInFileExplorer = async (path: string) => {
        showInFileExplorer(path);
    };

    return vaults.map((vault) => (
        <li key={vault.id}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <FolderListItem>
                            <FolderListItem.Header>
                                <FolderListItem.Title>
                                    {vault.name}
                                </FolderListItem.Title>
                                <FolderListItem.Desc>
                                    {vault.filepath}
                                    oub
                                </FolderListItem.Desc>
                            </FolderListItem.Header>

                            <FolderListItem.Action>
                                <DropdownMenu
                                    onOpenChange={(val) => setShowTooltip(!val)}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            onClick={(e) => e.stopPropagation()}
                                            variant={"ghost"}
                                            size={"icon"}
                                        >
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            className="flex items-center gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenInFileExplorer(
                                                    vault.filepath
                                                );
                                            }}
                                        >
                                            <ArchiveIcon className="size-4" />
                                            <span>Reveal in file explorer</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </FolderListItem.Action>
                        </FolderListItem>
                    </TooltipTrigger>
                    {showTooltip && (
                        <TooltipContent side="bottom">
                            <p>{vault.filepath}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </li>
    ));
};
