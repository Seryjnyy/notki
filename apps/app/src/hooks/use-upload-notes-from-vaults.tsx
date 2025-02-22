import { useUploadNotesFromDirsWithCheck } from "~/hooks/use-upload-notes-from-dirs-with-check"
import { removeVaultByPath } from "~/lib/services/vault-service"
import useVaults from "~/hooks/use-vaults"

export const useUploadNotesFromVaults = () => {
  const uploadNotesFromDirsWithCheck = useUploadNotesFromDirsWithCheck()
  const { refetchVaults } = useVaults()

  const onFailedVaults = (failedPaths: string[]) => {
    failedPaths.forEach((path) => {
      removeVaultByPath(path)
    })

    // Re-fetches the global store
    refetchVaults()
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
      onFailedDirs: onFailedVaults,
      onSucceededDirs: () => {},
    })
  }
}
