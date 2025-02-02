import NoteCard from "@repo/ui/components/display-notes/note-card"

import { useCallback, useMemo } from "react"
import { useNoteList } from "@repo/ui/providers/note-list-provider"
import { useNoteDisplaySettings } from "@repo/lib/stores/note-display-settings-store"

export default function SingleNote({
  removeNote,
}: {
  removeNote: (noteID: string) => void
}) {
  const paddingX = useNoteDisplaySettings.use.paddingX()
  const paddingY = useNoteDisplaySettings.use.paddingY()
  const { notes, activeIndex, setActiveIndex } = useNoteList()

  const handleRemoveNote = useCallback(
    (noteID: string) => {
      removeNote(noteID)

      if (activeIndex >= notes.length - 1) {
        setActiveIndex(activeIndex - 1)
      }
    },
    [activeIndex, notes, removeNote]
  )

  const getNote = useCallback(() => {
    if (notes.length == 0 || activeIndex < 0 || activeIndex >= notes.length)
      return null

    const note = notes[activeIndex]

    if (!note) return null

    return note
  }, [notes, activeIndex])

  const currentNote = useMemo(() => getNote(), [getNote])

  // Basically the same code as with grid display
  return (
    <ul
      className="grid"
      style={{
        gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
        gap: `0px`,
        padding: `${paddingY}px ${paddingX}px`,
      }}
    >
      {currentNote && (
        <li key={currentNote.id} className={`relative`}>
          <NoteCard note={currentNote} onDelete={handleRemoveNote} />
          <div className="absolute bottom-2  right-2">
            <div className="size-3 border-2 border-primary rounded-[var(--radius)]"></div>
            {/*  <Circle className="size-3 text-primary" />*/}
          </div>
        </li>
      )}
    </ul>
  )
}
