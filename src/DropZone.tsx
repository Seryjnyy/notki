import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNoteStore } from "./lib/note-store";

export default function DropZone() {
  const setNotes = useNoteStore((state) => state.setNotes);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // console.log(acceptedFiles);

    const readInNotes: Note[] = [];

    for (const file of acceptedFiles) {
      const txt = await file.text();
      readInNotes.push({ fileName: file.name, content: txt });
    }

    setNotes(readInNotes.slice());
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className="border">
        <input {...getInputProps()} className="border" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </>
  );
}
