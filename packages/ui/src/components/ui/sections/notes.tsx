import NotesView from "./notes-view";
import CopyAllContent from "./tool-bar/copy-all-content";
import FilterAndSort from "./tool-bar/FilterAndSort";
import ResetNotes from "./tool-bar/reset-notes";
import Search from "./tool-bar/Search";
import Settings from "./tool-bar/Settings";

export default function Notes() {
    return (
        <div className="flex gap-4 flex-col">
            <div className="px-2 md:px-8 ">
                <ResetNotes />
                <Settings />
                <FilterAndSort />
                <Search />
                <CopyAllContent />
            </div>

            <NotesView />
        </div>
    );
}
