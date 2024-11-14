import CopyAllContent from "@repo/ui/components/ui/sections/tool-bar/CopyAllContent";
import ResetNotes from "@repo/ui/components/ui/sections/tool-bar/ResetNotes";
import Search from "@repo/ui/components/ui/sections/tool-bar/Search";
import FilterAndSort from "~/components/compound-ui/FilterAndSort";
import NoteMap from "~/components/note-map-dialog";
import { SettingsDialog } from "~/components/settings/settings-dialog";

import FileUploadDialog from "~/components/file-upload-dialog";
import FilterSortDialog from "~/features/note-filter-sort/components/filter-sort-dialog";

// TODO : currently is not responsive
export default function Toolbar() {
    return (
        <div className="w-fit">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mr-12">
                    <div className="border rounded-[var(--radius)] flex gap-2">
                        <ResetNotes />
                        <FileUploadDialog />
                    </div>
                    <div className="border rounded-md flex items-center gap-1 ">
                        {/* <FilterAndSort /> */}
                        <FilterSortDialog />
                        <Search />
                        <div className="border-l">
                            <CopyAllContent />
                        </div>
                    </div>
                    <NoteMap />
                </div>

                <SettingsDialog />
            </div>
        </div>
    );
}
