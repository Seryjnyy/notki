import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Textarea } from "./ui/textarea";
import { getFileContent, saveFile } from "~/lib/file-services/file-service";
import { Button } from "@repo/ui/button";
import { open } from "@tauri-apps/api/dialog";

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
    return () => {
      console.log("filepath wtf", filepath);
      saveFile(filepath, value);
    };
  }, []);

  const textArea = useRef<HTMLTextAreaElement>(null);
  useHotkeys("ctrl+k", () => setValue("ctrl+k"));

  useHotkeys("ctrl+k", () => setValue("ctrl+k"), { enableOnFormTags: true });

  //   useEffect(() => {
  //     document.addEventListener("keydown", (ev) => setValue(ev.key));
  //   }, []);

  if (!filepath) return <>no.</>;

  const autoResize = () => {
    if (textArea.current) {
      textArea.current.style.height = "auto";
      textArea.current.style.height = textArea.current.scrollHeight + "px";
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

  return (
    <div className="">
      <Textarea
        ref={textArea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background h-screen w-full resize-none overflow-hidden rounded-none"
      />
    </div>
  );
}
