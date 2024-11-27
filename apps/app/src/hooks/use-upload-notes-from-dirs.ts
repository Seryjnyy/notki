import useUploadNotes from "@repo/lib/hooks/use-upload-notes"
import { guidGenerator } from "@repo/lib/utils/metadata-utils"
import { getTxtFilesWithAllDetail } from "~/lib/file-services/directory-service"
import { Note } from "@repo/lib/types/types"

// Returns the paths that were successfully uploaded
// TODO : no error handling whatsoever ;-;
export const useUploadNotesFromDirs = () => {
  const uploadNotes = useUploadNotes()
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

    const txtFiles = await Promise.all(
      paths.map((path) => getTxtFilesWithAllDetail(path, recursive))
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
    return paths
  }
}
