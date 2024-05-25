import { ScrollArea } from "@repo/ui/scroll-area";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { Toaster } from "@repo/ui/toaster";
import NoteTakingPage from "./components/note-taking-page";
import CreateDir from "./components/ui/create-dir";
import Sidebar from "./components/ui/sidebar";
import Titlebar from "./components/ui/titlebar";
import { useUiState } from "./lib/ui-store";
import AutoSave from "./components/ui/auto-save";
import NewVault from "./components/ui/new-vault";
import CommandBox from "./components/ui/command-box";
import MinimalTitlebar from "./components/ui/minimal-titlebar";
import { listen } from "@tauri-apps/api/event";
import TabbedView from "./components/ui/tabbed-view";
import FileSearchBox from "./components/ui/file-search-box";
import FileExplorer from "./components/ui/file-explorer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import MainPage from "@repo/ui/main-page";
import { TooltipProvider } from "@repo/ui/tooltip";
import { WorkspaceConfig, useWorkspaceConfig } from "./lib/workspace-store";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import CommandPalette from "./components/ui/command-palette";

function App() {
  // TODO : Should probably in component to reduce rerendering everything, or does zustand prevent that, I can't remember
  const uiState = useUiState((state) => state.uiState);
  const workspacePath = useWorkspaceConfig((state) => state.currentWorkspace);
  const setWorkspacePath = useWorkspaceConfig(
    (state) => state.setCurrentWorkspace
  );

  useEffect(() => {
    console.log("current workspace", workspacePath);
    const setUp = async () => {
      const res = await invoke("get_current_workspace");
      if (typeof res == "string") {
        // TODO : Check if actual directory
        // TODO : Check if have access to it
        const config = JSON.parse(res) as WorkspaceConfig;

        console.log("getting workspace", config.currentWorkspace);
        if (config.currentWorkspace == "") {
          return;
        }

        setWorkspacePath(config.currentWorkspace);
      }
    };

    setUp();
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark2" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Titlebar />
          {/* <MinimalTitlebar /> */}
          {workspacePath == "" && (
            <div className="h-screen overflow-hidden flex pt-7 ">
              <NewVault />
            </div>
          )}
          {workspacePath != "" && (
            <div className="h-screen overflow-hidden flex pt-7 ">
              {uiState.sidebar && <Sidebar />}

              <ResizablePanelGroup direction="horizontal" className="w-full ">
                {uiState.sideSection != "none" && (
                  <ResizablePanel minSize={28}>
                    {uiState.sideSection == "file-explorer" && <FileExplorer />}
                  </ResizablePanel>
                )}
                <ResizableHandle />

                <ResizablePanel>
                  {/* <CreateDir /> */}
                  <Button
                    onClick={async () => {
                      const res = await invoke("set_current_workspace", {
                        newCurrentWorkspace: "",
                      });
                      if (typeof res != "string") {
                        console.error(
                          "Error on setting current workspace, returned value is not a string."
                        );
                        return;
                      }
                      const parsed = JSON.parse(res) as WorkspaceConfig;
                      setWorkspacePath(parsed.currentWorkspace);
                    }}
                  >
                    Reset
                  </Button>
                  {uiState.section == "note-manager" && <TabbedView />}
                  {uiState.section == "note-viewer" && (
                    <div className="mt-7 w-full">
                      <MainPage />
                    </div>
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
              {/* <ScrollArea className="mt-[30px] h-screen w-full"> */}
              {/* <MainPage />
            <Footer /> */}
              {/* <CreateDir /> */}
              {/* <AutoSave /> */}

              {/* <NewVault /> */}
              {/* <NoteTakingPage /> */}
              {/* </ScrollArea> */}
            </div>
          )}
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </TooltipProvider>

        <Toaster />
        <CommandPalette />
        {/* <CommandBox /> */}
        {/* <FileSearchBox /> */}
      </ThemeProvider>
    </>
  );
}

export default App;
