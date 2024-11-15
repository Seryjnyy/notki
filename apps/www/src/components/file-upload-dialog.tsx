import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import DropZone from "@repo/ui/components/ui/sections/drop-zone";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useNavigationLock } from "~/hooks/use-navigation-lock";
import { NavigationAwareDialog } from "./compound-ui/navigation-aware-components.js";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { useUploadSettingsStore } from "@repo/lib/stores/upload-file-settings-store";

export default function FileUploadDialog() {
    const [open, setOpen] = useState(false);
    const { enableNavigation } = useNavigationLock();
    const setReplace = useUploadSettingsStore.use.setReplace();
    const replace = useUploadSettingsStore.use.replace();

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
                        <DialogTrigger asChild>
                            <Button size={"icon"} variant={"secondary"}>
                                <Upload className="text-primary" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add txt files</p>
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
