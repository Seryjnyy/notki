import { UploadIcon } from "@radix-ui/react-icons"
import useUploadNotes from "@repo/lib/hooks/use-upload-notes"
import { Note } from "@repo/lib/types/types"
import { guidGenerator } from "@repo/lib/utils/metadata-utils"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useToast } from "@repo/ui/hooks/use-toast"

export default function DropZone({
  onSuccess,
  replace,
  title,
  desc,
}: {
  onSuccess?: () => void
  replace?: boolean
  title?: string
  desc?: string
}) {
  const uploadNotes = useUploadNotes()
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const readInNotes: Note[] = []

      for (const file of acceptedFiles) {
        if (file.type !== "text/plain") continue // Shouldn't happen, but just in case

        const txt = await file.text()
        readInNotes.push({
          id: guidGenerator(),
          fileName: file.name,
          content: txt,
          size: file.size,
          lastModified: file.lastModified,
          characterCount: txt.length,
          filepath: "",
        })
      }

      toast({
        title: "Reading in notes",
        description: `Read in ${readInNotes.length} notes out of ${acceptedFiles.length} viable files.`,
      })

      uploadNotes(readInNotes, replace)
      onSuccess?.()
    },
    [uploadNotes, replace]
  )

  // TODO: If toast messages or some feedback system gets implemented they maybe show something about accepted/rejected files, their count or something
  // can use acceptedFiles, fileRejections
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
    },
    onDrop,
  })

  return (
    <>
      <div
        {...getRootProps()}
        className="border-dashed border-2 p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-[var(--radius)] h-full"
      >
        <input {...getInputProps()} className="border" />
        {isDragActive ? (
          <div className="flex justify-center items-center flex-col gap-4 select-none">
            <div className="p-3 border rounded-[var(--radius)] w-fit">
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center flex-col text-center">
              <p>Drop the files here...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col gap-4 select-none">
            <div className="p-3 border rounded-[var(--radius)] w-fit">
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center flex-col text-center">
              <p>
                {title
                  ? title
                  : "  Drag 'n' drop some files here, or click to select files"}
              </p>
              <p className="text-muted-foreground text-xs text-center">
                {desc
                  ? desc
                  : "Only text files allowed. The ones with a .txt file extension."}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
