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
  Clock,
  EllipsisVertical,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react"
import * as React from "react"
import { ComponentPropsWithoutRef } from "react"
import { getFolderNameFromFilepath } from "~/lib/utils.ts"
import { Recent, useRecentsStore } from "~/stores/recents-store.ts"
import { showInFileExplorer } from "~/lib/services/directory-service.ts"
import { useUploadNotesFromRecents } from "~/hooks/use-upload-notes-from-recents"

interface RecentDropdownProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu> {
  recent: Recent
}

export default function RecentDropdown({
  recent,
  ...props
}: RecentDropdownProps) {
  const removeRecent = useRecentsStore.use.removeRecent()
  const uploadNoteFromRecents = useUploadNotesFromRecents()

  const folderName = React.useMemo(
    () => getFolderNameFromFilepath(recent.path),
    [recent.path]
  )

  // Duplicate code with app-sidebar-recents
  const openFolder = async (recent: Recent) => {
    await uploadNoteFromRecents({
      dirs: [recent.path],
      recursive: recent.recursive ?? false,
      replace: true,
    })
  }

  const addNotesFromFolder = async (recent: Recent) => {
    await uploadNoteFromRecents({
      dirs: [recent.path],
      recursive: recent.recursive ?? false,
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
          <Clock className="size-3" />
          <span> {folderName}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            addNotesFromFolder(recent)
          }}
        >
          <Plus className="size-4" />
          <span>Add notes from folder</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            openFolder(recent)
          }}
        >
          <FolderOpen className="size-4" />
          <span>Open folder</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenInFileExplorer(recent.path)
            }}
          >
            <ArchiveIcon className="size-4" />
            <span>Reveal in file explorer</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              removeRecent(recent.path)
            }}
          >
            <Trash2 className="size-4" />
            <span>Remove recent</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2 text-xs">
            {new Date(recent.lastOpened).toLocaleString()}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
