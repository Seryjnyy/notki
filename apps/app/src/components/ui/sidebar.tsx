import { FileIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import ModeToggle from "@repo/ui/mode-toggle";
import { produce } from "immer";
import { useTempUiState } from "~/lib/temp-uistate-store";
import { useUiState } from "~/lib/ui-store";

export default function Sidebar() {
  const tempUiState = useTempUiState((state) => state.tempUiState);
  const setTempUiState = useTempUiState((state) => state.setTempUiState);
  const uiState = useUiState((state) => state.uiState);
  const setUiState = useUiState((state) => state.setUiState);

  return (
    <div className="w-12 h-screen pt-8 bg-secondary">
      <div className="flex flex-col">
        <Button
          variant="ghost"
          className={`rounded-none text-primary  ${uiState.sideSection == "file-explorer" ? "border-primary border-l" : ""}`}
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

        <Button
          variant="ghost"
          className={`rounded-none text-primary  ${tempUiState.settingsOpened ? "border-primary border-l" : ""}`}
          onClick={() =>
            setTempUiState(
              produce(tempUiState, (draft) => {
                draft.settingsOpened = true;
              })
            )
          }
        >
          <GearIcon className="w-4 h-4" />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}
