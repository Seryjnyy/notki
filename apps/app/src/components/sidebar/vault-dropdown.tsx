import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Button } from "@repo/ui/components/ui/button"
import {
  ArchiveIcon,
  EllipsisVertical,
  FolderCog2,
  FolderOpen,
  Plus,
  VaultIcon,
} from "lucide-react"
import { ComponentPropsWithoutRef } from "react"
import { Vault as VaultType, Vault } from "~/lib/backend-types.ts"
import { showInFileExplorer } from "~/lib/file-services/directory-service.ts"
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs.ts"

interface VaultDropdownProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu> {
  vault: Vault
}

export default function VaultDropdown({ vault, ...props }: VaultDropdownProps) {
  const uploadNoteFromDirs = useUploadNotesFromDirs()

  // Duplicate code with parent
  const openVault = (vault: VaultType) => {
    uploadNoteFromDirs({
      dirs: [vault.filepath],
      recursive: true,
      replace: true,
    })
  }

  const addNotesFromVault = (vault: VaultType) => {
    uploadNoteFromDirs({
      dirs: [vault.filepath],
      recursive: true,
      replace: false,
    })
  }

  const handleOpenInFileExplorer = (path: string) => {
    showInFileExplorer(path)
  }

  return (
    <DropdownMenu {...props}>
      <div className="flex justify-end items-center">
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            variant={"ghost"}
            size={"icon"}
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center gap-2">
          <VaultIcon className="size-3" />
          <span>{vault.name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            addNotesFromVault(vault)
          }}
        >
          <Plus className="size-4" />
          <span>Add notes from vault</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            openVault(vault)
          }}
        >
          <FolderOpen className="size-4" />
          <span>Open vault</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenInFileExplorer(vault.filepath)
            }}
          >
            <ArchiveIcon className="size-4" />
            <span>Reveal in file explorer</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              console.error("Not implemented")
            }}
            disabled
          >
            <FolderCog2 className="size-4" />
            <span>Manage vault</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
