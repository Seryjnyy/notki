import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "./components/ui/use-toast";
import { useNoteStore } from "./lib/note-store";
import { Note } from "./lib/types";

export default function DropZone() {
  const setNotes = useNoteStore((state) => state.setNotes);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const readInNotes: Note[] = [];

    for (const file of acceptedFiles) {
      console.log(file.type);
      if (file.type != "text/plain") {
        console.log("wrong type");
        toast({
          variant: "destructive",
          title: "Wrong type of file provided",
          description: `Only text/plain files allowed, you added a ${file.type}.`,
        });
        continue;
      }

      const txt = await file.text();
      readInNotes.push({
        fileName: file.name,
        content: txt,
        size: file.size,
        lastModified: file.lastModified,
      });
    }

    setNotes(readInNotes.slice());
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className="border p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-lg"
      >
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
