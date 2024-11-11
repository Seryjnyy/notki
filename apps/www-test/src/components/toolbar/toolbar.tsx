import CopyAllContent from "@repo/ui/CopyAllContent";
import ResetNotes from "@repo/ui/ResetNotes";
import Search from "@repo/ui/Search";
import FilterAndSort from "~/components/compound-ui/FilterAndSort";
import NoteMap from "~/components/note-map-dialog";
import { SettingsDialog } from "~/components/settings/settings-dialog";

import FileUploadDialog from "~/components/file-upload-dialog";

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
                        <FilterAndSort />
                        <Search />
                        <CopyAllContent />
                    </div>
                    <NoteMap />
                </div>

                <SettingsDialog />
            </div>
        </div>
    );
}
