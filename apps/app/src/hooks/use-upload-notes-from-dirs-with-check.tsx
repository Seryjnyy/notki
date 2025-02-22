import { useToast } from "@repo/ui/hooks/use-toast"
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs"
import { Button } from "@repo/ui/components/ui/button"

export const useUploadNotesFromDirsWithCheck = () => {
  const uploadNotesFromDirs = useUploadNotesFromDirs()
  const { toast } = useToast()

  return async ({
    dirs,
    onFailedDirs,
    onSucceededDirs,
    recursive = false,
    replace = false,
  }: {
    dirs: string[] | string
    onFailedDirs: (failedPaths: string[]) => void
    onSucceededDirs: (succeededPaths: string[]) => void
    recursive?: boolean
    replace?: boolean
  }) => {
    const res = await uploadNotesFromDirs({
      dirs: dirs,
      recursive: recursive,
      replace: replace,
    })

    if (res.fail.length > 0) {
      const isMultipleDirs = res.fail.length > 1
      toast({
        title: `${isMultipleDirs ? "Directories do" : "Directory does"} not exist`,
        description: `Do you want to remove ${isMultipleDirs ? "them" : "it"}?`,
        action: (
          <Button
            onClick={() => {
              onFailedDirs(res.fail)
              toast({
                title: `${isMultipleDirs ? "Directories were" : "Directory was"} removed`,
              })
            }}
          >
            Remove
          </Button>
        ),
      })
    }

    if (res.success.length > 0) {
      onSucceededDirs(res.success)
    }

    return res
  }
}
