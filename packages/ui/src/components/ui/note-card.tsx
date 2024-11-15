import { ScrollArea, ScrollBar } from "./scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
// import { Note, NoteSettings } from "./types";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Note, NoteSettings } from "@repo/lib/types/types";
import { formatBytes, unixToTimestamp } from "@repo/lib/utils/metadata-utils";
import { cn } from "@repo/ui/lib/utils";
import { useMemo } from "react";
import { CopyButton } from "../copy-button";
import { Button } from "./button";

export default function NoteCard({
    note,
    settings,
    handleDelete,
}: {
    note: Note;
    settings: NoteSettings;
    handleDelete: (id: string) => void;
}) {
    const formattedDate = useMemo(() => {
        return unixToTimestamp(note.lastModified);
    }, [note]);

    const formattedBytes = useMemo(() => formatBytes(note.size), [note]);

    const onDelete = () => {
        handleDelete(note.id);
    };

    return (
        <Card
            // className="basis-full"
            className="w-full"
        >
            {settings.header.visible && (
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle
                        className={cn("text-muted-foreground select-none", {
                            "sr-only": !settings.header.options.title,
                        })}
                    >
                        <div className="w-[16rem] overflow-x-clip">
                            {note.fileName}
                        </div>
                    </CardTitle>
                    {settings.header.options.actions.visible && (
                        <div className="w-fit ml-auto space-x-8">
                            {settings.header.options.actions.options.copy && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CopyButton
                                                value={note.content}
                                                className="[&_svg]:size-4"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Copy contents</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {settings.header.options.actions.options.remove && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="px-2 py-0"
                                                variant={"ghost"}
                                                onClick={onDelete}
                                            >
                                                <Cross1Icon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Remove note</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    )}
                </CardHeader>
            )}
            <CardContent
                style={{
                    paddingLeft: `${settings.styling.note.paddingX}rem`,
                    paddingRight: `${settings.styling.note.paddingX}rem`,
                }}
            >
                <ScrollArea>
                    <pre
                        style={{
                            letterSpacing: `${settings.content.letterSpacing}rem`,
                            lineHeight: `${settings.content.lineHeight}rem`,
                            paddingBottom: `${settings.styling.note.paddingBottom}rem`,
                            paddingTop: `${settings.styling.note.paddingTop}rem`,
                            fontSize: `${settings.styling.content.fontSize}rem`,
                        }}
                        className={
                            settings.styling.note.textSelectable
                                ? ""
                                : "select-none"
                        }
                    >
                        {note.content}
                    </pre>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
            {settings.metadata.visible && (
                <CardFooter className="flex justify-between flex-wrap gap-4 select-none">
                    <div className="space-x-4">
                        <span className="text-sm text-muted-foreground">
                            {settings.metadata.options.lastModified &&
                                formattedDate}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {settings.metadata.options.size && formattedBytes}
                        </span>
                    </div>
                    <div className="space-x-4">
                        <span className="text-sm text-muted-foreground">
                            {settings.metadata.options.characterCount &&
                                `${note.characterCount} characters`}
                        </span>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
