import { useEffect, useRef, useState } from "react";
import { Textarea } from "./textarea";
import {
  writeFile,
  exists,
  readTextFile,
  BaseDirectory,
  createDir,
} from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { guidGenerator } from "@repo/lib/metadata-utils";
import { formatIntoAutosaveFilename, formatIntoFilename } from "~/lib/file";
import { Button } from "@repo/ui/button";
import { invoke } from "@tauri-apps/api/tauri";

export default function AutoSave() {
  const [value, setValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    `C:\\Users\\jakub\\Documents\\test\\`
  );
  const [fileName, setFileName] = useState<string | null>(null);

  const autoSaveTimer = useRef<NodeJS.Timeout | null>();

  useEffect(() => {
    const setUp = async () => {
      // get permission
      const selected = await open({ directory: true, multiple: false });
      if (typeof selected != "string") {
        return;
      }
      setSelectedLocation(selected);
      writeFile(`${selected}\\allowed-path.txt`, selected);

      let alreadyExists = false;
      let id = null;
      do {
        console.log("happens");
        // generate unique id for document
        id = guidGenerator();
        // check if file like this already exists
        alreadyExists = await exists(
          `${selected}\\${formatIntoAutosaveFilename(id)}`
        );
      } while (alreadyExists);

      setFileName(formatIntoAutosaveFilename(id!));
    };

    const another = async () => {
      const selected = await open({ directory: true, multiple: false });
      if (typeof selected != "string") {
        return;
      }

      setSelectedLocation(selected);

      createDir(`${selected}/testing`);
    };

    const check = () => {
      writeFile(`C:\\Users\\jakub\\Documents\\test\\lets-see.txt`, "testi2ng");
    };
    // setUp();
    // check();
    // another();
    // writeFile(
    //   `C:\\Users\\jakub\\Documents\\test\\testing\\lets-see.txt`,
    //   "what up"
    // );
  }, []);

  const save = (newValue: string) => {
    if (selectedLocation) {
      if (fileName) {
        console.log(fileName);
        writeFile(`${selectedLocation}\\${fileName}`, newValue);
      }
    }
  };

  const onChange = (newValue: string) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    setValue(newValue);

    autoSaveTimer.current = setTimeout(() => save(newValue), 2000);
  };

  return (
    <div>
      {value}
      <Button
        onClick={async () => {
          const selected = await open({ directory: true, multiple: false });
          if (typeof selected != "string") {
            return;
          }
          setSelectedLocation(selected);
          console.log(selected);
          if (selectedLocation)
            invoke("expand_scope", { folderPath: selected });
        }}
      >
        Expand scope
      </Button>
      <Button
        onClick={async () => {
          await open({ directory: true, multiple: false });
        }}
      >
        Open test directory
      </Button>
      <Button
        onClick={async () => {
          const res = await exists("", { dir: BaseDirectory.AppData });
          console.log("exists ", res ? "true" : "false");

          writeFile("test-txt-viewer.txt", "testing this stuff", {
            dir: BaseDirectory.AppData,
          });
        }}
      >
        Write to appdata
      </Button>
      <Button
        onClick={() => {
          //   if (selectedLocation)
          console.log(`C:\\Users\\jakub\\Documents\\test\\some.txt`);

          writeFile(`C:\\Users\\jakub\\Documents\\test\\some234.txt`, "works?");
        }}
      >
        Write file to test
      </Button>
      <Button
        onClick={() => {
          //   if (selectedLocation)
          writeFile(`$C:\\Users\\jakub\\Documents\\test2\\some.txt`, "works?");
        }}
      >
        Write file to test2
      </Button>
      <Button
        onClick={() => {
          invoke("create_new_vault", {
            folderPath: "C:\\Users\\jakub\\Documents\\test2",
          });
        }}
      >
        Get access to test2
      </Button>
      {selectedLocation}
      <Textarea
        // ref={textArea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background h-screen w-full resize-none overflow-hidden rounded-none"
      />
    </div>
  );
}
