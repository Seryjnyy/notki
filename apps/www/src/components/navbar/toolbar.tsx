import CopyAllContent from "@repo/ui/components/ui/sections/tool-bar/copy-all-content";
import ResetNotes from "@repo/ui/components/ui/sections/tool-bar/reset-notes";
import { SettingsDialog } from "~/components/settings/settings-dialog";

import FileUploadDialog from "~/components/file-upload-dialog";
import FilterSortDialog from "~/components/note-filter-sort/filter-sort-dialog";
import SearchDialog from "~/components/note-filter-sort/search-dialog";
import NoteMap from "../note-map-dialog";

// TODO : currently is not responsive
export default function Toolbar({
    exclude,
}: {
    exclude?: { noteMap?: boolean };
}) {
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
                        <div className="border-l pl-1">
                            <CopyAllContent />
                        </div>
                    </div>
                    {(!exclude || !exclude?.noteMap) && <NoteMap />}
                </div>

                <div className="ml-2">
                    <SettingsDialog />
                </div>
            </div>
        </div>
    );
}
