import { ExclamationTriangleIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";

import { useNoteDisplaySettings } from "~/stores/note-display-settings-store";
import { useNoteSettings } from "~/stores/note-settings-store";
import { useStyleStore } from "~/stores/style-store";

export default function SomethingWentWrong() {
    const resetStyle = useStyleStore.use.reset();
    const resetCardStyle = useNoteSettings.use.reset();
    const resetDisplayStyle = useNoteDisplaySettings.use.reset();

    const onResetPreferences = () => {
        resetStyle();
        resetCardStyle();
        resetDisplayStyle();
    };

    return (
        <div className="flex flex-col gap-4 pt-8 px-8">
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                    Please refresh the page. If the issue continues, try
                    resetting your preferences.
                </AlertDescription>
            </Alert>
            <Button
                className="space-x-2"
                onClick={() => window.location.reload()}
            >
                <span>Refresh the page</span> <UpdateIcon />
            </Button>
            <Button className="space-x-2" onClick={onResetPreferences}>
                <span>Reset preferences</span> <UpdateIcon />
            </Button>
        </div>
    );
}
