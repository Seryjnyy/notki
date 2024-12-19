import { useRemoveCurrentNoteShortcut } from "@repo/ui/hooks/use-remove-current-note-shortcut"
import { useCopyCurrentNoteContent } from "@repo/ui/hooks/use-copy-current-note-content"
import { useNoteList } from "@repo/ui/providers/note-list-provider"

// I don't really like this approach, but need to put these hooks somewhere
export default function NoteListShortcuts() {
  const { notes, activeIndex } = useNoteList()
  const currentNote = notes ? notes[activeIndex] : undefined
  useRemoveCurrentNoteShortcut(currentNote ? currentNote.id : "")

  useCopyCurrentNoteContent(currentNote)

  return null
}
