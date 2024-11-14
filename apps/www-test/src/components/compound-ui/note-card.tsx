import { formatBytes, unixToTimestamp } from "@repo/lib/metadata-utils";
import { Note } from "@repo/lib/types";
import { Button } from "@repo/ui/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/ui/card";
import { ScrollArea, ScrollBar } from "@repo/ui/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { CopyIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import useNoteContentSettings from "~/hooks/note-settings/use-note-content-settings";
import useNoteFooterSettings from "~/hooks/note-settings/use-note-footer-settings";
import useNoteHeaderSettings from "~/hooks/note-settings/use-note-header-settings";
import useNotePaddingSettings from "~/hooks/note-settings/use-note-padding-settings";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { useNotes } from "~/hooks/use-notes";
import { cn } from "~/lib/utils";

const CopyButton = ({ content }: { content: string }) => {
    const [_, copy] = useCopyToClipboard();

    const onCopy = () => {
        copy(content);
    };

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={"ghost"} onClick={onCopy} size={"icon"}>
                        <CopyIcon className="size-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copy contents</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const Header = ({
    note,
    onRemove,
}: {
    note: Note;
    onRemove?: (note: Note) => void;
}) => {
    const { header } = useNoteHeaderSettings();

    if (!header.header) return null;

    return (
        <CardHeader className="flex flex-row items-center justify-between py-0 my-0 pt-2">
            <CardTitle
                className={cn("text-muted-foreground select-none", {
                    "sr-only": !header.title,
                })}
            >
                <div className="w-[16rem] overflow-x-clip">{note.fileName}</div>
            </CardTitle>
            {(header.copy || header.remove) && (
                <div className="w-fit ml-auto space-x-8 h-fit">
                    {header.copy && <CopyButton content={note.content} />}

                    {header.remove && (
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => onRemove?.(note)}
                                        size={"icon"}
                                    >
                                        <XIcon className="size-4" />
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
    );
};

const Footer = ({ note }: { note: Note }) => {
    const { footer } = useNoteFooterSettings();

    const formattedDate = useMemo(() => {
        return unixToTimestamp(note.lastModified);
    }, [note]);

    const formattedBytes = useMemo(() => formatBytes(note.size), [note]);

    if (!footer.metadata) return null;

    return (
        <CardFooter className="flex justify-between flex-wrap gap-4 select-none py-0 mt-2">
            <div className="space-x-4">
                <span className="text-sm text-muted-foreground">
                    {footer.lastModified && formattedDate}
                </span>
                <span className="text-sm text-muted-foreground">
                    {footer.size && formattedBytes}
                </span>
            </div>
            <div className="space-x-4">
                <span className="text-sm text-muted-foreground">
                    {footer.characterCount &&
                        `${note.characterCount} characters`}
                </span>
            </div>
        </CardFooter>
    );
};

const Content = ({ note }: { note: Note }) => {
    const { content } = useNoteContentSettings();
    const { padding } = useNotePaddingSettings();

    const lineHeight = content.fontSize + 16;
    return (
        <CardContent
            className="py-0  "
            style={{
                paddingLeft: `${padding.paddingX}px`,
                paddingRight: `${padding.paddingX}px`,
            }}
        >
            <ScrollArea>
                <pre
                    style={{
                        letterSpacing: `${content.letterSpacing}px`,
                        fontSize: content.fontSize + "px",
                        lineHeight: lineHeight + "px",
                        paddingBottom: `${padding.paddingBottom}px`,
                        paddingTop: `${padding.paddingTop}px`,
                        fontFamily: "inherit",
                        // fontSize: `${content.fontSize}rem`,
                        // lineHeight: `${content.lineHeight}rem`,
                    }}
                    className={content.textSelectable ? "" : "select-none"}
                >
                    {note.content}
                </pre>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </CardContent>
    );
};

export default function NoteCard({
    note,
    onDelete,
}: {
    note: Note;
    onDelete?: (id: string) => void;
}) {
    return (
        <Card className="p-0 ">
            <Header note={note} onRemove={(note) => onDelete?.(note.id)} />
            <Content note={note} />
            <Footer note={note} />
        </Card>
    );
}