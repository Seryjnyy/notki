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
import { ComponentPropsWithoutRef, useState } from "react"
import { Vault as VaultType, Vault } from "~/lib/backend-types.ts"
import { showInFileExplorer } from "~/lib/services/directory-service.ts"
import { useOpenVaultInManager } from "~/components/vault-manager/manage-vaults-dialog.tsx"
import { useUploadNotesFromVaults } from "~/hooks/use-upload-notes-from-vaults"

interface VaultDropdownProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu> {
  vault: Vault
}

export default function VaultDropdown({ vault, ...props }: VaultDropdownProps) {
  const uploadNotesFromVaults = useUploadNotesFromVaults()
  const openVaultInManager = useOpenVaultInManager(vault)
  const [open, setOpen] = useState<boolean>(false)

  // Duplicate code with parent
  const openVault = (vault: VaultType) => {
    uploadNotesFromVaults({
      dirs: [vault.filepath],
      recursive: true,
      replace: true,
    })
  }

  const addNotesFromVault = (vault: VaultType) => {
    uploadNotesFromVaults({
      dirs: [vault.filepath],
      recursive: true,
      replace: false,
    })
  }

  const handleOpenInFileExplorer = (path: string) => {
    showInFileExplorer(path)
  }

  return (
    <DropdownMenu {...props} open={open} onOpenChange={setOpen}>
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
              // Have to control this, or it creates a bug where nothing is clickable after the dialog is closed.
              setOpen(false)
              openVaultInManager()
            }}
          >
            <FolderCog2 className="size-4" />
            <span>Manage vault</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
