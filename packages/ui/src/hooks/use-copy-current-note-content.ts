import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import { useHotkeys } from "react-hotkeys-hook"
import { copyToClipboard } from "@repo/ui/components/copy-button"
import { Note } from "@repo/lib/types/types"
import { useToast } from "@repo/ui/hooks/use-toast"

// TODO :Same problem as useRemoveCurrentNoteShortcut, if note list is rendered multiple times then this shortcut will be
//  called multiple times. Should have some middleware typa thing where it checks if shortcut is already registered or
//  not. Or if all

const useCopyCurrentNoteContent = (currentNote: Note | undefined) => {
  const shortcutInfo = useShortcutInfo(
    AVAILABLE_SHORTCUTS.COPY_CURRENT_NOTE_CONTENT
  )
  const { toast } = useToast()

  useHotkeys(
    shortcutInfo?.hotkeys.join(",") ?? "",
    async () => {
      if (!currentNote) return
      await copyToClipboard(currentNote.content)

      toast({
        title: "Content copied",
        description:
          currentNote.content.slice(0, 30) +
          (currentNote.content.length > 30 ? "..." : ""),
        duration: 1000,
      })
    },
    {
      enabled: shortcutInfo?.enabled ?? false,
    }
  )
}

export { useCopyCurrentNoteContent }
