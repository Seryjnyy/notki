import { Note, NoteSettings, Order } from "../types/types";

// TODO : I dont really see the need for this stuff to be here anymore
// useNoteFilterStore does filtering/sorting now, and its cleaner to have the sorting logic there
// this could be removed when app is updated to new www-test stuff
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
