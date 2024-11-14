import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { produce } from "immer";

import { useUiState } from "~/lib/ui-store";
export default function MainDialog() {
    const uiState = useUiState((state) => state.uiState);
    const setUiState = useUiState((state) => state.setUiState);

    return (
        <Dialog
            open={uiState.settings}
            onOpenChange={(val) => {
                setUiState(
                    produce(uiState, (draft) => {
                        draft.settings = val;
                    })
                );
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Theme settings</DialogTitle>
                    <DialogClose />
                    <DialogDescription>
                        Select a theme colour and the font colour in notes.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
