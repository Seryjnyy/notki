import { FileIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { produce } from "immer";
import { useUiState } from "~/lib/ui-store";

export default function Sidebar() {
  const uiState = useUiState((state) => state.uiState);
  const setUiState = useUiState((state) => state.setUiState);

  return (
    <div className="w-12 h-screen border-r pt-8">
      <div className="flex flex-col">
        <div className="flex justify-center items-center relative">
          {uiState.sideSection == "file-explorer" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button
            variant="ghost"
            className="rounded-none"
            onClick={() =>
              setUiState(
                produce(uiState, (draft) => {
                  if (uiState.sideSection == "file-explorer") {
                    draft.sideSection = "none";
                  } else {
                    draft.sideSection = "file-explorer";
                  }
                })
              )
            }
          >
            <FileIcon className="w-4 h-4" />
          </Button>
        </div>
        {/* <div className="flex justify-center items-center relative">
          {uiState.section == "note-manager" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button className="" variant="ghost" onClick={() => setUiState(produce(uiState, draft => {
            draft.sidebarActive = 
          }))}>
            m<FileIcon className="w-4 h-4" />
          </Button>
        </div> */}
        {/* <div className="flex justify-center items-center relative">
          {uiState.section == "note-viewer" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button className="" variant="ghost">
            v<FileIcon className="w-4 h-4" />
          </Button>
        </div> */}

        <Button variant="ghost" className="p-0 rounded-none">
          <GearIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
