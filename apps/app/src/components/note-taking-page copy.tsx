import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Textarea } from "./ui/textarea";

export default function NoteTakingPage() {
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  useHotkeys("ctrl+k", () => setValue("ctrl+k"));

  useHotkeys("ctrl+k", () => setValue("ctrl+k"), { enableOnFormTags: true });

  //   useEffect(() => {
  //     document.addEventListener("keydown", (ev) => setValue(ev.key));
  //   }, []);

  const autoResize = () => {
    if (textArea.current) {
      textArea.current.style.height = "auto";
      textArea.current.style.height = textArea.current.scrollHeight + "px";
    }
  };

  const onChange = (newValue: string) => {
    autoResize();
    setValue(newValue);
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
