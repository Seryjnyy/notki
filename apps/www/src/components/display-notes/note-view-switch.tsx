import { useNotes } from "~/hooks/use-notes";
import { useNoteDisplaySettings } from "~/stores/note-display-settings-store";
import NoteList from "./note-list";
import SingleNote from "./single-note";

export default function NoteViewSwitch() {
    const { removeNote } = useNotes(); // TODO : idk, should components get it themselves? useNoteList could provide it too idk
    const display = useNoteDisplaySettings.use.display();

    if (display === "slideshow") return <SingleNote removeNote={removeNote} />;

    return <NoteList removeNote={removeNote} />;
}
