import { UploadIcon } from "@radix-ui/react-icons";
import useUploadNotes from "@repo/lib/hooks/use-upload-notes";
import { Note } from "@repo/lib/types/types";
import { guidGenerator } from "@repo/lib/utils/metadata-utils";
import { toast } from "@repo/ui/hooks/use-toast";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function DropZone({
    onSuccess,
    replace,
}: {
    onSuccess?: () => void;
    replace?: boolean;
}) {
    const uploadNotes = useUploadNotes();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
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
                    id: guidGenerator(),
                    fileName: file.name,
                    content: txt,
                    size: file.size,
                    lastModified: file.lastModified,
                    characterCount: txt.length,
                });
            }

            uploadNotes(readInNotes, replace);
            onSuccess?.();
        },
        [uploadNotes, replace]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <>
            {/* TODO : update the roundness to var radius */}
            <div
                {...getRootProps()}
                className="border-dashed border-2 p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-lg h-full"
            >
                <input {...getInputProps()} className="border" />
                {isDragActive ? (
                    <div className="flex justify-center items-center flex-col gap-4 select-none">
                        <div className="p-3 border rounded-full w-fit">
                            <UploadIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center flex-col">
                            <p>Drop the files here...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center flex-col gap-4 select-none">
                        <div className="p-3 border rounded-full w-fit">
                            <UploadIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center flex-col">
                            <p>
                                Drag 'n' drop some files here, or click to
                                select files
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Only text files allowed. The ones with a .txt
                                file extension.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
