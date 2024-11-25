import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/ui/dialog";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { Map, Minus, Plus, Search, Undo2 } from "lucide-react";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import { useFilteredNotes } from "@repo/lib/stores/note-store";
import {
    AVAILABLE_SHORTCUTS,
    useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store";
import ShortcutAwareDialogTrigger from "@repo/ui/components/shortcut/shortcut-aware-dialog-trigger";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";
import { Slider } from "@repo/ui/components/ui/slider";
import { useNotes } from "@repo/lib/hooks/use-notes";
import { NavigationAwareDialog } from "./navigation-aware-components";
import NoteCard from "./display-notes/note-card";
import Toolbar from "./navbar/toolbar";
import UserStyledList from "./display-notes/user-styled-list";

const Notes = memo(() => {
    const { removeNote } = useNotes();
    const filteredSortedNotes = useFilteredNotes();

    // Double memoization, is it needed?
    const memoedNotes = useMemo(() => {
        return filteredSortedNotes.map((note) => (
            <li key={note.id}>
                <NoteCard note={note} onDelete={removeNote} />
            </li>
        ));
    }, [filteredSortedNotes, removeNote]);

    return <> {memoedNotes}</>;
});

const Controls = ({
    scale,
    setScale,
    scaleLimits,
}: {
    scale: number;
    setScale: (scale: number) => void;
    scaleLimits: { min: number; max: number };
}) => {
    const step = 0.1;

    return (
        <div className="max-w-[10rem] min-w-[10rem] flex items-center gap-1 border px-2 py-1 rounded-[var(--radius)]">
            <Search />
            <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => {
                    if (scale - step <= scaleLimits.min) return;
                    setScale(scale - step);
                }}
            >
                <Minus className="size-3" />
            </Button>
            <Slider
                max={scaleLimits.max}
                min={scaleLimits.min}
                step={step}
                value={[scale]}
                onValueChange={(val) => val.length > 0 && setScale(val[0]!)}
            />
            <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => {
                    if (scale + step > scaleLimits.max) return;
                    setScale(scale + step);
                }}
            >
                <Plus className="size-3" />
            </Button>
        </div>
    );
};

const NoteMap = () => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const toggleNoteMapShortcut = useShortcutInfo(
        AVAILABLE_SHORTCUTS.TOGGLE_NOTE_MAP
    );

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const scaleLimits = { min: 0.1, max: 4 };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(
            Math.max(scaleLimits.min, scale + delta),
            scaleLimits.max
        );
        setScale(newScale);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("wheel", handleWheel, {
            passive: false,
        });
        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, [scale]);

    return (
        <NavigationAwareDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ShortcutAwareDialogTrigger
                            asChild
                            shortcut={toggleNoteMapShortcut}
                        >
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                className="border-primary/50"
                            >
                                <Map />
                            </Button>
                        </ShortcutAwareDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Note map{" "}
                            <TooltipShortcutKeys
                                shortcut={toggleNoteMapShortcut}
                            />
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="min-w-full min-h-full p-0 rounded-none sm:rounded-none ">
                <DialogHeader className="sr-only">
                    <DialogTitle className="z-50 ">Note map</DialogTitle>
                    <DialogDescription className="sr-only">
                        This is the note map dialog, where the notes are
                        arranged on a canvas that you can move around in and
                        zoom in and out of.
                    </DialogDescription>
                </DialogHeader>
                <div
                    className="fixed  z-50 bottom-0 left-0 w-full px-3 backdrop-blur-md p-2 flex gap-4 border-t border-x justify-between rounded-t-[var(--radius)] flex-wrap "
                    tabIndex={0}
                >
                    <div className="w-fit mx-auto ">
                        <Toolbar exclude={{ noteMap: true }} />
                    </div>
                    <div className="flex justify-between items-center gap-2 mx-auto">
                        <Controls
                            scale={scale}
                            setScale={setScale}
                            scaleLimits={scaleLimits}
                        />
                        <div className="flex gap-2">
                            <Button
                                size={"sm"}
                                onClick={() => setPosition({ x: 0, y: 0 })}
                                className="flex items-center gap-2"
                            >
                                <Undo2 className="size-5" /> Position
                            </Button>
                            <Button
                                size={"sm"}
                                onClick={() => setScale(1)}
                                className="flex items-center gap-2"
                            >
                                <Undo2 className="size-5" /> Zoom
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full  relative select-none ">
                    <div
                        ref={containerRef}
                        className="h-full  w-full  overflow-hidden bg-background cursor-move absolute top-0 "
                        onPointerDown={handleMouseDown}
                        onPointerMove={handleMouseMove}
                        onPointerUp={handleMouseUp}
                        onPointerLeave={handleMouseUp}
                    >
                        <div
                            className="relative"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                transformOrigin: "0 0",
                                transition: isDragging
                                    ? "none"
                                    : "transform 0.1s ease-out",
                            }}
                        >
                            <div className="w-[300vw] flex flex-wrap gap-4">
                                <UserStyledList>
                                    <Notes />
                                </UserStyledList>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
};

export default NoteMap;
