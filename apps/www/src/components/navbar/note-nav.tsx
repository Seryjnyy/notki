import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigationLock } from "~/hooks/use-navigation-lock";
import { useNoteList } from "~/providers/note-list-provider";
import {
    AVAILABLE_SHORTCUTS,
    useShortcutsStore,
} from "@repo/lib/stores/shortcuts-store";

export default function NoteNav() {
    const { activeIndex, setActiveIndex, itemsRef, notes } = useNoteList();
    const [intermediateActiveIndex, setIntermediateActiveIndex] =
        useState(activeIndex);

    const { isNavigationEnabled } = useNavigationLock();
    const shortcuts = useShortcutsStore.use.shortcuts();

    const isNextNoteShortcutEnabled = useMemo(() => {
        return (
            shortcuts.find(
                (shortcut) => shortcut.id === AVAILABLE_SHORTCUTS.NEXT_NOTE
            )?.enabled ?? false
        );
    }, [shortcuts]);

    const isPrevNoteShortcutEnabled = useMemo(() => {
        return (
            shortcuts.find(
                (shortcut) => shortcut.id === AVAILABLE_SHORTCUTS.PREVIOUS_NOTE
            )?.enabled ?? false
        );
    }, [shortcuts]);

    const scrollToItem = (index: number) => {
        const ref = itemsRef.current?.get(notes[index].id);

        ref?.current?.scrollIntoView({ block: "center" });
    };

    useHotkeys(
        "up, left",
        (e) => {
            e.preventDefault();
            moveBackward();
        },
        {
            enabled: isNavigationEnabled && isPrevNoteShortcutEnabled,
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
        "down, right",
        (e) => {
            e.preventDefault();
            moveForward();
        },
        {
            enabled: isNavigationEnabled && isNextNoteShortcutEnabled,
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

    // Bit hacky, but useEffect is for syncing right???
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
                                    {isPrevNoteShortcutEnabled && (
                                        <>
                                            <br />
                                            <span className="flex items-center gap-2">
                                                {" "}
                                                <ArrowUp className="size-3" />{" "}
                                                or{" "}
                                                <ArrowLeft className="size-3" />
                                            </span>
                                            arrow key
                                        </>
                                    )}
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
                                    {isNextNoteShortcutEnabled && (
                                        <>
                                            <br />
                                            <span className="flex items-center gap-2">
                                                {" "}
                                                <ArrowDown className="size-3" />{" "}
                                                or{" "}
                                                <ArrowRight className="size-3" />
                                            </span>
                                            arrow key
                                        </>
                                    )}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </section>
        </nav>
    );
}
