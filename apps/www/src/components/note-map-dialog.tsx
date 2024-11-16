import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Slider } from "@repo/ui/components/ui/slider";
import { useNotes } from "~/hooks/use-notes";
import { NavigationAwareDialog } from "./compound-ui/navigation-aware-components";
import NoteCard from "./compound-ui/note-card";
import Toolbar from "./navbar/toolbar";

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

    return <ul>{memoedNotes}</ul>;
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
                onValueChange={(val) => setScale(val[0])}
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

    const handleWheel = (e: React.WheelEvent) => {
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

        container.addEventListener("wheel", handleWheel as any, {
            passive: false,
        });
        return () => {
            container.removeEventListener("wheel", handleWheel as any);
        };
    }, [scale]);

    return (
        <NavigationAwareDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                className="border-primary/50"
                            >
                                <Map />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Note map</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="min-w-full min-h-full p-0 rounded-none sm:rounded-none ">
                <DialogHeader className="sr-only">
                    <DialogTitle className="sr-only">
                        Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>
                <div className="fixed  z-50 bottom-0 left-0 w-full px-3 backdrop-blur-md p-2 flex gap-4 border-t border-x justify-between rounded-t-[var(--radius)] flex-wrap ">
                    <div className="w-fit mx-auto">
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
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
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
                                <Notes />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
};

export default NoteMap;
