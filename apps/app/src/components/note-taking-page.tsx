import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Textarea } from "./ui/textarea";
import { getFileContent, saveFile } from "~/lib/file-services/file-service";
import { Button } from "@repo/ui/button";
import { open } from "@tauri-apps/api/dialog";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useConfig } from "./use-config";

export default function NoteTakingPage({
  filepath,
}: {
  filepath: string | undefined;
}) {
  const [value, setValue] = useState("");
  const autoSaveTimer = useRef<NodeJS.Timeout | null>();
  const themeConfig = useConfig();

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
    return () => {
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
      saveFile(filepath, value);
    }, 2000);
  };

  const textColour =
    themeConfig.noteFontColour == "primary"
      ? "text-primary"
      : "text-black dark:text-white";
  console.log("what", textColour);
  return (
    <div>
      <ScrollArea className=" h-screen ">
        <Textarea
          ref={textArea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-background h-screen w-full resize-none overflow-hidden rounded-none ${textColour}`}
        />
      </ScrollArea>
    </div>
  );
}
