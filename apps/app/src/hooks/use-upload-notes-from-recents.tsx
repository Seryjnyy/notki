import { useUploadNotesFromDirsWithCheck } from "~/hooks/use-upload-notes-from-dirs-with-check"
import { useRecentsStore } from "~/stores/recents-store"

export const useUploadNotesFromRecents = () => {
  const uploadNotesFromDirsWithCheck = useUploadNotesFromDirsWithCheck()
  const addRecent = useRecentsStore.use.addRecent()
  const removeRecent = useRecentsStore.use.removeRecent()

  const onFailedDirs = (failedPaths: string[]) => {
    failedPaths.forEach((path: string) => {
      removeRecent(path)
    })
  }
  const onSucceededDirs = (succeededPaths: string[], recursive: boolean) => {
    succeededPaths.forEach((path: string) => {
      addRecent(path, recursive)
    })
  }

  return async ({
    dirs,
    recursive = false,
    replace = false,
  }: {
    dirs: string[] | string
    recursive?: boolean
    replace?: boolean
  }) => {
    return await uploadNotesFromDirsWithCheck({
      dirs: dirs,
      recursive: recursive,
      replace: replace,
      onFailedDirs: onFailedDirs,
      onSucceededDirs: (paths) => onSucceededDirs(paths, recursive),
    })
  }
}
