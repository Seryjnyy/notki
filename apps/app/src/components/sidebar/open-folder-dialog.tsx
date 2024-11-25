import {
    AVAILABLE_SHORTCUTS,
    useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store";
import { useUploadSettingsStore } from "@repo/lib/stores/upload-file-settings-store";
import { NavigationAwareDialog } from "@repo/ui/components/navigation-aware-components";
import ShortcutAwareDialogTrigger from "@repo/ui/components/shortcut/shortcut-aware-dialog-trigger";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";
import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { RadioCard, RadioCardTitle } from "@repo/ui/components/ui/radio-card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { DoorOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { OpenFolderButton, OpenFolderSettings } from "../landing/open-folder";

export default function OpenFolderDialog() {
    const [open, setOpen] = useState(false);

    // Idk if to use uploadSettings for this or keep it separate
    const setReplace = useUploadSettingsStore.use.setReplace();
    const replace = useUploadSettingsStore.use.replace();
    // const [addBy, setAddBy] = useState<AddBy>("replace");

    const toggleOpenFolderShortcut = useShortcutInfo(
        AVAILABLE_SHORTCUTS.TOGGLE_OPEN_FOLDER
    );

    const addByOptions = ["add", "replace"] as const;
    const addBy = useMemo(() => (replace ? "replace" : "add"), [replace]);

    return (
        <NavigationAwareDialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ShortcutAwareDialogTrigger
                            asChild
                            shortcut={toggleOpenFolderShortcut}
                        >
                            <Button className="flex items-center gap-2">
                                <DoorOpen /> Open folder
                            </Button>
                        </ShortcutAwareDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Add notes from folder{" "}
                            <TooltipShortcutKeys
                                shortcut={toggleOpenFolderShortcut}
                            />
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Open folder</DialogTitle>
                    <DialogDescription className="sr-only">
                        This will open the folder or folders you select and add
                        or replace the notes.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full">
                    <div className="pb-8 space-y-6">
                        <div>
                            <Label>Options</Label>
                            <div className="flex pt-2">
                                <OpenFolderSettings />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Add notes by</Label>

                            <div className="grid grid-cols-2 gap-2">
                                {addByOptions.map((option) => (
                                    <RadioCard
                                        isActive={addBy == option}
                                        onClick={() =>
                                            setReplace(option === "replace")
                                        }
                                        key={option}
                                    >
                                        <RadioCardTitle className="capitalize">
                                            {option}
                                        </RadioCardTitle>
                                    </RadioCard>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex  flex-col">
                        <div className="w-full">
                            <OpenFolderButton
                                className="w-full"
                                replace={addBy === "replace"}
                                onSuccess={() => setOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
}
