import { open } from "@tauri-apps/api/dialog";
import { readDir, readTextFile } from "@tauri-apps/api/fs";

import { Button } from "@repo/ui/button";
import { metadata } from "tauri-plugin-fs-extra-api";
import { useState } from "react";
import { Note } from "@repo/lib/types";
import { formatBytes, guidGenerator } from "@repo/lib/metadata-utils";
import NoteCard from "@repo/ui/note-card";
import { usePreferenceStore } from "@repo/lib/preference-store";

export default function CreateDir() {
  const settings = usePreferenceStore((state) => state.settings);
  const [notes, setNotes] = useState<Note[]>([]);

  const onClick = async () => {
    const selected = await open({ directory: true, multiple: false });

    if (typeof selected != "string") {
      return;
    }
    // await writeTextFile(`${selected}\\test.txt`, "file contents");
    const entries = await readDir(selected, { recursive: true });
    console.log(JSON.stringify(entries));
    const tempNotes: Note[] = [];
    for (const entry of entries) {
      // entry.
      const meta = await metadata(entry.path);
      const res = await readTextFile(entry.path);
      console.log(res, meta);
      tempNotes.push({
        id: guidGenerator(),
        content: res,
        fileName: entry.name ?? "unknown",
        lastModified: meta.modifiedAt.getTime(),
        characterCount: meta.size,
        size: meta.size,
      });
    }
    setNotes(tempNotes);
    // await createDir(selected, { recursive: true })
    //   .then(async () => {
    //     console.log("success");
    //   })
    //   .catch((e) => console.log(e));
    // console.log(selected);
  };

  return (
    <div>
      <Button onClick={onClick}>create</Button>
      <div>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            handleDelete={() => {}}
            settings={settings}
          ></NoteCard>
        ))}
      </div>
    </div>
  );
}
