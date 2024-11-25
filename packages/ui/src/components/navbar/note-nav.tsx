import {
    AVAILABLE_SHORTCUTS,
    useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigationLock } from "@repo/ui/hooks/use-navigation-lock";
import { useNoteList } from "@repo/ui/providers/note-list-provider";

export default function NoteNav() {
    const { activeIndex, setActiveIndex, itemsRef, notes } = useNoteList();
    const [intermediateActiveIndex, setIntermediateActiveIndex] =
        useState(activeIndex);

    const { isNavigationEnabled } = useNavigationLock();

    const nextNoteShortcut = useShortcutInfo(AVAILABLE_SHORTCUTS.NEXT_NOTE);
    const previousNoteShortcut = useShortcutInfo(
        AVAILABLE_SHORTCUTS.PREVIOUS_NOTE
    );

    useEffect(() => {
        // Sync with notes, in case length changes and activeIndex is out of bounds
        if (notes.length <= activeIndex) {
            setActiveIndex(notes.length - 1);
        }
    }, [notes]);

    const scrollToItem = (index: number) => {
        const ref = itemsRef.current?.get(notes[index]?.id ?? "");

        ref?.current?.scrollIntoView({ block: "center" });
    };

    useHotkeys(
        previousNoteShortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault();
            moveBackward();
        },
        {
            enabled:
                isNavigationEnabled && (previousNoteShortcut?.enabled ?? false),
        }
    );
    const moveBackward = () => {
        if (activeIndex === 0) return;
        const newIndex = Math.max(0, activeIndex - 1);
        scrollToItem(newIndex);
        setActiveIndex(newIndex);
    };

    const moveForward = () => {
        if (notes.length == 0) return;
        const newIndex = Math.min(notes.length - 1, activeIndex + 1);
        scrollToItem(newIndex);
        setActiveIndex(newIndex);
    };

    useHotkeys(
        nextNoteShortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault();
            moveForward();
        },
        {
            enabled:
                isNavigationEnabled && (nextNoteShortcut?.enabled ?? false),
        }
    );

    const onIndexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == "") {
            setIntermediateActiveIndex(-1);
            return;
        }

        const index = parseInt(e.target.value) - 1;
        if (index < 0 || index >= notes.length) return;

        scrollToItem(index);
        setActiveIndex(index);
    };

    // Bit hacky, but useEffect is for syncing right??? (with external state, but this is internal, so idk anymore)
    useEffect(() => {
        setIntermediateActiveIndex(activeIndex);
    }, [activeIndex]);

    if (notes.length === 0) return null;

    return (
        <nav className="select-none flex items-center gap-2   ">
            <section className="flex items-center border pr-3 rounded-[var(--radius)]">
                <Input
                    value={
                        intermediateActiveIndex === -1
                            ? ""
                            : intermediateActiveIndex + 1
                    }
                    type="number"
                    className="w-[4rem] rounded-none rounded-l-[var(--radius)] border  mr-1 pr-1   "
                    onChange={onIndexInputChange}
                />
                /{notes.length}
            </section>
            <section>
                <TooltipProvider>
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={"icon"}
                                    disabled={
                                        activeIndex === 0 ||
                                        notes.length == 0 ||
                                        !isNavigationEnabled
                                    }
                                    onClick={moveBackward}
                                >
                                    <ArrowUp />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Previous.
                                    <TooltipShortcutKeys
                                        shortcut={previousNoteShortcut}
                                    />
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={"icon"}
                                    disabled={
                                        activeIndex + 1 === notes.length ||
                                        notes.length == 0 ||
                                        !isNavigationEnabled
                                    }
                                    onClick={moveForward}
                                >
                                    <ArrowDown />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Next.
                                    <TooltipShortcutKeys
                                        shortcut={nextNoteShortcut}
                                    />
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </section>
        </nav>
    );
}
