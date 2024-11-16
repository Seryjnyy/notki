import NoteNav from "./note-nav";
import Toolbar from "./toolbar";

export default function FixedBottomNavBar() {
    return (
        <div className="bottom-0 fixed left-0   flex justify-center w-full">
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
