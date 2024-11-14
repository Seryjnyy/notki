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
import { Map } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TOOLTIP_DELAY_DURATION } from "~/config/tooltip.config";
import { useNotes } from "~/hooks/use-notes";
import { NavigationAwareDialog } from "./compound-ui/navigation-aware-components";
import NoteCard from "./compound-ui/note-card";
import { SettingsDialog } from "./settings/settings-dialog";

const NoteMap = () => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { notes, removeNote } = useNotes();

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
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.1, scale + delta), 4);
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

    // TODO : potential problem with this, haven't tested it yet, but will notes rerender themselves when they change? like when note settings change?
    const memoedNotes = useMemo(() => {
        return notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={removeNote} />
        ));
    }, [notes]);

    return (
        <NavigationAwareDialog>
            <DialogTrigger asChild>
                <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                className="border-primary"
                            >
                                <Map />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Note map</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="min-w-full min-h-full p-0 rounded-none sm:rounded-none ">
                <div className="fixed bottom-4 right-4 z-50">
                    <SettingsDialog />
                </div>
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
                                {memoedNotes}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
};

export default NoteMap;
