import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@repo/ui/collapsible";
import { formatBytes, unixToTimestamp } from "@repo/lib/metadata-utils";
import { Note, NoteSettings } from "@repo/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui/card";
import { ReactNode, useMemo, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/tooltip";
import { Button } from "@repo/ui/button";
import { ChevronDown, CopyIcon, Cross, Undo, Undo2, XIcon } from "lucide-react";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { cn } from "~/lib/utils";
import { useControls } from "leva";
import { Checkbox } from "@repo/ui/checkbox";
import { Label } from "@repo/ui/label";

const CopyButton = ({ content }: { content: string }) => {
    const [_, copy] = useCopyToClipboard();

    const onCopy = () => {
        copy(content);
    };

    return (
        <TooltipProvider>
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

const Header = ({ note }: { note: Note }) => {
    const headerOptions = {
        visible: true,
        title: {
            visible: true,
        },
        actions: {
            visible: true,
            copy: {
                visible: true,
            },
            remove: {
                visible: true,
            },
        },
    };

    if (!headerOptions.visible) return null;

    return (
        <CardHeader className="flex flex-row items-center justify-between py-0 my-0">
            <CardTitle
                className={cn("text-muted-foreground select-none", {
                    "sr-only": !headerOptions.title.visible,
                })}
            >
                <div className="w-[16rem] overflow-x-clip">{note.fileName}</div>
            </CardTitle>
            {headerOptions.actions.visible && (
                <div className="w-fit ml-auto space-x-8">
                    {headerOptions.actions.copy.visible && (
                        <CopyButton content={note.content} />
                    )}

                    {headerOptions.actions.remove.visible && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        // onClick={onDelete}
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
    const footerOptions = {
        visible: true,
        lastModified: {
            visible: true,
        },
        size: {
            visible: true,
        },
        characterCount: {
            visible: true,
        },
    };

    const formattedDate = useMemo(() => {
        return unixToTimestamp(note.lastModified);
    }, [note]);

    const formattedBytes = useMemo(() => formatBytes(note.size), [note]);

    if (!footerOptions.visible) return null;

    return (
        <CardFooter className="flex justify-between flex-wrap gap-4 select-none py-0 mt-2">
            <div className="space-x-4">
                <span className="text-sm text-muted-foreground">
                    {footerOptions.lastModified.visible && formattedDate}
                </span>
                <span className="text-sm text-muted-foreground">
                    {footerOptions.size.visible && formattedBytes}
                </span>
            </div>
            <div className="space-x-4">
                <span className="text-sm text-muted-foreground">
                    {footerOptions.characterCount.visible &&
                        `${note.characterCount} characters`}
                </span>
            </div>
        </CardFooter>
    );
};

export default function NoteCard({
    note,
    handleDelete,
}: {
    note: Note;
    handleDelete: (id: string) => void;
}) {
    return (
        <>
            <Card className="p-0">
                <Header note={note} />
                <CardContent className="py-0">
                    <p>Card Content</p>
                </CardContent>
                <Footer note={note} />
            </Card>
            {/* <div>
                <Setting>
                    <Setting>
                        <CheckSetting
                            label="Visible"
                            value={true}
                            onChange={() => {}}
                        />
                    </Setting>
                </Setting>
            </div> */}
        </>
    );
}

interface CheckSettingProps {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}

const CheckSetting = ({ label, value, onChange }: CheckSettingProps) => {
    return (
        <div className="flex items-center justify-between max-w-[12rem] ">
            <div>
                <Label className="max-w-[10rem]  py-1 truncate">{label}</Label>
                <Undo2 />
            </div>
            <Checkbox
                checked={value}
                onCheckedChange={(val) => {
                    if (val == "indeterminate") {
                        onChange(false);
                        return;
                    }
                    onChange(val);
                }}
            />
        </div>
    );
};

// card settings
// grid settings

const Setting = ({
    defaultOpen = true,
    children,
}: {
    defaultOpen?: boolean;
    children?: ReactNode;
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="flex justify-between items-center w-full [&[data-state=open]>svg]:rotate-180 transition-transform font-bold">
                Header
                <ChevronDown className="transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-2 border-l">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};
