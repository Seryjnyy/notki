import { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Textarea } from "./ui/textarea";
import { getFileContent, saveFile } from "~/lib/file-services/file-service";
import { Button } from "@repo/ui/button";
import { open } from "@tauri-apps/api/dialog";
import { ScrollArea } from "@repo/ui/scroll-area";

const DataWithLabel = ({
    amount,
    label,
}: {
    amount: string | number;
    label: string;
}) => {
    return (
        <span>
            {amount} <span className="text-muted-foreground">{label}</span>
        </span>
    );
};

const countWords = (str: string) => {
    // empty string was 1 without this
    if (str.length == 0) return 0;
    return str.trim().split(/\s+/).length;
};

const Metadata = ({ content }: { content: string }) => {
    const wordCount = useMemo(() => countWords(content), [content]);

    return (
        <div className="absolute bottom-16 right-2 border rounded-xl px-2 text-sm space-x-4">
            <DataWithLabel amount={content.length} label="ch" />
            <DataWithLabel amount={wordCount} label="words" />
            {/* <DataWithLabel amount={4} label="kb" /> */}
            <span>20/04/2001</span>
        </div>
    );
};

export default function NoteTakingPage({
    filepath,
}: {
    filepath: string | undefined;
}) {
    const [value, setValue] = useState("");
    const autoSaveTimer = useRef<NodeJS.Timeout | null>();

    useEffect(() => {
        console.log(filepath);
        const setUp = async () => {
            if (!filepath) return;
            const res = await getFileContent(filepath);

            setValue(res);
        };

        setUp();
    }, [filepath]);

    useEffect(() => {
        if (!filepath) return;
        // This messes up stuff
        return () => {
            if (value == "") return;
            saveFile(filepath, value);
        };
    }, []);

    const textArea = useRef<HTMLTextAreaElement>(null);
    useHotkeys("ctrl+k", () => setValue("ctrl+k"));

    useHotkeys("ctrl+k", () => setValue("ctrl+k"), { enableOnFormTags: true });

    //   useEffect(() => {
    //     document.addEventListener("keydown", (ev) => setValue(ev.key));
    //   }, []);

    if (!filepath)
        return (
            <div className="flex items-center justify-center h-screen">
                Nothing to show, open a file.
            </div>
        );

    const autoResize = () => {
        if (textArea.current) {
            textArea.current.style.height = "auto";
            textArea.current.style.height =
                100 + textArea.current.scrollHeight + "px";
        }
    };

    const onChange = (newValue: string) => {
        autoResize();
        setValue(newValue);

        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

        setValue(newValue);

        autoSaveTimer.current = setTimeout(() => {
            console.log("autosave");
            saveFile(filepath, newValue);
        }, 100);
    };

    return (
        <div className="relative">
            <ScrollArea className=" h-screen bg-stone-900">
                <Textarea
                    ref={textArea}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`bg-inherit h-screen w-full resize-none overflow-hidden rounded-none focus:outline-none focus:border-none focus:none`}
                />
            </ScrollArea>
            <Metadata content={value} />
        </div>
    );
}
