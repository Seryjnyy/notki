import { Note, NoteSettings, Order } from "./types";

export function sortNotesByTime(notes: Note[], order: Order) {
  switch (order) {
    case "asc":
      return [...notes].sort((a, b) => a.lastModified - b.lastModified);
    case "desc":
      return [...notes].sort((a, b) => b.lastModified - a.lastModified);
  }
}

export function sortNotes(notes: Note[], settings: NoteSettings) {
  switch (settings.sort.sortBy) {
    case "time":
      return sortNotesByTime(notes, settings.sort.order);
  }

  return notes;
}
