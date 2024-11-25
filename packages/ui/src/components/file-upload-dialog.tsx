import {
    AVAILABLE_SHORTCUTS,
    useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store";
import { useUploadSettingsStore } from "@repo/lib/stores/upload-file-settings-store";
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
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { useNavigationLock } from "@repo/ui/hooks/use-navigation-lock";
import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { NavigationAwareDialog } from "./navigation-aware-components";
import { RadioCard, RadioCardTitle } from "./ui/radio-card";

export default function FileUploadDialog() {
    const [open, setOpen] = useState(false);
    const { enableNavigation } = useNavigationLock();

    const setReplace = useUploadSettingsStore.use.setReplace();
    const replace = useUploadSettingsStore.use.replace();

    const addByOptions = ["add", "replace"] as const;
    const addBy = useMemo(() => (replace ? "replace" : "add"), [replace]);

    const toggleFileUploadDialogShortcut = useShortcutInfo(
        AVAILABLE_SHORTCUTS.TOGGLE_UPLOAD
    );

    const onUpload = () => {
        // When dialog is closed manually it needs to update navigation lock
        enableNavigation();
        setOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <NavigationAwareDialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ShortcutAwareDialogTrigger
                            asChild
                            shortcut={toggleFileUploadDialogShortcut}
                        >
                            <Button size={"icon"} variant={"secondary"}>
                                <Upload className="text-primary" />
                            </Button>
                        </ShortcutAwareDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Add txt files{" "}
                            <TooltipShortcutKeys
                                shortcut={toggleFileUploadDialogShortcut}
                            />
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add txt files</DialogTitle>
                    <DialogDescription className="sr-only">
                        Select some txt files to view. Chose to add the notes or
                        replace the existing notes.
                    </DialogDescription>
                </DialogHeader>
                <DropZone onSuccess={onUpload} replace={replace} />
                <div className="space-y-2">
                    <Label>Add notes by</Label>

                    <div className="grid grid-cols-2 gap-2">
                        {addByOptions.map((option) => (
                            <RadioCard
                                isActive={addBy == option}
                                onClick={() => {
                                    if (option === "replace") {
                                        setReplace(true);
                                    } else {
                                        setReplace(false);
                                    }
                                }}
                                key={option}
                            >
                                <RadioCardTitle className="capitalize">
                                    {option}
                                </RadioCardTitle>
                            </RadioCard>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
}
