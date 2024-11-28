import { Button, ButtonProps } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { open } from "@tauri-apps/api/dialog";
import { DoorOpen } from "lucide-react";
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs";
import { useOpenFolderSettingsStore } from "~/stores/open-folder-settings-store";
import { useRecentsStore } from "~/stores/recents-store";

interface OpenButtonProps extends ButtonProps {
    replace?: boolean;
    onSuccess?: () => void;
}

// TODO : should probably move logic to hook at some point, especially when it might get used with a command
const OpenFolderButton = ({
    onClick,
    onSuccess,
    replace = false,
    ...props
}: OpenButtonProps) => {
    // TODO : needs loader, spinner maybe
    const { addRecent } = useRecentsStore();
    const recursive = useOpenFolderSettingsStore.use.recursive();

    const multiple = useOpenFolderSettingsStore.use.multiple();

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
            replace: replace,
        });

        paths.forEach((path) => addRecent(path, recursive));
        onSuccess?.();
    };

    return (
        <Button
            onClick={(e) => {
                onBrowse();
                onClick?.(e);
            }}
            {...props}
        >
            <DoorOpen /> Open folder{multiple ? "s" : ""}
        </Button>
    );
};

const OpenFolderSettings = () => {
    const recursive = useOpenFolderSettingsStore.use.recursive();
    const setRecursive = useOpenFolderSettingsStore.use.setRecursive();

    const multiple = useOpenFolderSettingsStore.use.multiple();
    const setMultiple = useOpenFolderSettingsStore.use.setMultiple();

    return (
        <>
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
        </>
    );
};

export { OpenFolderButton, OpenFolderSettings };
