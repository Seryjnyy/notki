import useUploadNotes from "@repo/lib/hooks/use-upload-notes"
import { guidGenerator } from "@repo/lib/utils/metadata-utils"
import { getTxtFilesWithAllDetail } from "~/lib/services/directory-service.ts"
import { Note } from "@repo/lib/types/types"
import { useToast } from "@repo/ui/hooks/use-toast"

// Returns the paths that were successfully uploaded
// TODO : no error handling whatsoever ;-;
export const useUploadNotesFromDirs = () => {
  const uploadNotes = useUploadNotes()
  const { toast } = useToast()

  return async ({
    dirs,
    recursive = false,
    replace = false,
  }: {
    dirs: string[] | string
    recursive?: boolean
    replace?: boolean
  }) => {
    const paths = Array.isArray(dirs) ? dirs : [dirs]
    const succeededPaths: string[] = []
    const failedPaths: string[] = []

    const txtFiles = await Promise.all(
      paths.map(async (path) => {
        try {
          const res = await getTxtFilesWithAllDetail(path, recursive)
          succeededPaths.push(path)
          return res
        } catch (error) {
          console.error(error)
          failedPaths.push(path)
          return []
        }
      })
    ).then((res) => res.flat())

    const readInNotes: Note[] = txtFiles.map((file) => ({
      id: guidGenerator(),
      fileName: file.name ?? "???",
      content: file.content,
      size: file.metadata.size,
      lastModified: file.metadata.modifiedAt.getTime(),
      characterCount: file.content.length,
      filepath: file.path,
    }))

    uploadNotes(readInNotes, replace)

    toast({
      title: "Reading in notes",
      description: `Read in ${readInNotes.length} notes from ${succeededPaths.length}/${paths.length} folders.`,
    })

    return { success: succeededPaths, fail: failedPaths }
  }
}
