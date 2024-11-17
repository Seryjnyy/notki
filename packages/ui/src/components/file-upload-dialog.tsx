import {
    AVAILABLE_SHORTCUTS,
    useShortcut,
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
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useNavigationLock } from "@repo/ui/hooks/use-navigation-lock";
import { NavigationAwareDialog } from "./navigation-aware-components";

export default function FileUploadDialog() {
    const [open, setOpen] = useState(false);
    const { enableNavigation } = useNavigationLock();
    const setReplace = useUploadSettingsStore.use.setReplace();
    const replace = useUploadSettingsStore.use.replace();
    const toggleFileUploadDialogShortcut = useShortcut(
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
                <DropZone onSuccess={onUpload} />
                <RadioGroup
                    value={replace ? "replace" : "add"}
                    onValueChange={(val) => {
                        setReplace(val === "replace");
                    }}
                    className="flex"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="add" id="option-add" />
                        <Label>Add</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="replace" id="option-replace" />
                        <Label>Replace</Label>
                    </div>
                </RadioGroup>
            </DialogContent>
        </NavigationAwareDialog>
    );
}
