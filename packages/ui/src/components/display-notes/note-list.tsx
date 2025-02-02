import NoteCard from "@repo/ui/components/display-notes/note-card"

import UserStyledList from "@repo/ui/components/display-notes/user-styled-list"
import { useNoteList } from "@repo/ui/providers/note-list-provider"

export default function NoteList({
  removeNote,
}: {
  removeNote: (noteID: string) => void
}) {
  const { notes, activeIndex, setActiveIndex, getRef } = useNoteList()

  // TODO : rerenders everything every time notes are navigated, could be a issue with lots of notes
  // TODO : should this be virtualized? memoed?
  return (
    <UserStyledList>
      {notes.map((note, index) => (
        <li
          key={note.id}
          ref={getRef(note.id)}
          onClick={() => setActiveIndex(index)}
          className={`relative`}
        >
          <NoteCard note={note} onDelete={removeNote} />
          {index === activeIndex && (
            <div className="absolute bottom-2  right-2">
              <div className="size-3 border-2 border-primary rounded-[var(--radius)]"></div>
            </div>
          )}
        </li>
      ))}
    </UserStyledList>
  )
}
