import CopyAllContent from "@repo/ui/components/ui/sections/tool-bar/CopyAllContent";
import ResetNotes from "@repo/ui/components/ui/sections/tool-bar/ResetNotes";
import NoteMap from "~/components/note-map-dialog";
import { SettingsDialog } from "~/components/settings/settings-dialog";

import FileUploadDialog from "~/components/file-upload-dialog";
import FilterSortDialog from "~/features/note-filter-sort/components/filter-sort-dialog";
import SearchDialog from "~/features/note-filter-sort/components/search-dialog";

// TODO : currently is not responsive
export default function Toolbar() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="border rounded-[var(--radius)] flex gap-2 flex-wrap p-1">
                        <ResetNotes />
                        <FileUploadDialog />
                    </div>
                    <div className="border rounded-md flex items-center gap-1 p-1">
                        <FilterSortDialog />
                        <SearchDialog />
                        <div className="border-l">
                            <CopyAllContent />
                        </div>
                    </div>
                    {/* <NoteMap /> */}
                </div>

                <SettingsDialog />
            </div>
        </div>
    );
}
