import NoteNav from "@repo/ui/components/navbar/note-nav";
import Toolbar from "@repo/ui/components/navbar/toolbar";

export default function AbsoluteBottomNavBar() {
    // TODO : virtually the same code as fixed bottom bar in ui, this might have to be refactored, unless it changes more in the future
    return (
        <div className="bottom-0 absolute left-0   flex justify-center w-full">
            <div
                className="flex  border-t border-l rounded-t-[var(--radius)] backdrop-blur-md border-r  w-fit flex-wrap"
                tabIndex={-1}
                id="main-nav"
            >
                <div className="z-50  p-2  w-full ">
                    <Toolbar />
                </div>
                <div className="  p-2 w-fit mx-auto">
                    <NoteNav />
                </div>
            </div>
        </div>
    );
}
