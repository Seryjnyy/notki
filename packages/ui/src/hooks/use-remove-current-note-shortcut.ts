import { useNotes } from "@repo/lib/hooks/use-notes"
import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import { useHotkeys } from "react-hotkeys-hook"

// Since this relies on useNoteList hook it means that there could be multiple instances of this hook if the note list
// is rendered multiple times.
// So there could be duplicate calls, but it's okay because they are delete calls
const useRemoveCurrentNoteShortcut = (currentNoteID: string) => {
  const shortcutInfo = useShortcutInfo(AVAILABLE_SHORTCUTS.REMOVE_CURRENT_NOTE)
  const { removeNote } = useNotes()

  useHotkeys(
    shortcutInfo?.hotkeys.join(",") ?? "",
    () => {
      removeNote(currentNoteID)
    },
    {
      enabled: shortcutInfo?.enabled ?? false,
    }
  )
}

export { useRemoveCurrentNoteShortcut }
