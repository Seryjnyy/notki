import MainPage from "@repo/ui/main-page";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { Toaster } from "@repo/ui/toaster";
import { TooltipProvider } from "@repo/ui/tooltip";
import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable";
import MainDialog from "./components/main-dialog";
import CommandPalette from "./components/ui/command-palette";
import FileExplorer from "./components/ui/file-explorer";
import NewVault from "./components/ui/new-vault";
import Sidebar from "./components/ui/sidebar";
import TabbedView from "./components/ui/tabbed-view";
import Titlebar from "./components/ui/titlebar";

import CommandBox from "./components/ui/command-box";
import FileSearchBox from "./components/ui/file-search-box";
import { useUiState } from "./lib/ui-store";
import { WorkspaceConfig, useWorkspaceConfig } from "./lib/workspace-store";

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
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <div className={` w-full h-screen flex flex-col  pt-7`}>
                    <Titlebar />
                    {/* <MinimalTitlebar /> */}
                    {workspacePath == "" && (
                        <div className="h-screen overflow-hidden flex ">
                            <NewVault />
                        </div>
                    )}
                    {workspacePath != "" && (
                        <div className="h-screen overflow-hidden flex  ">
                            {uiState.sidebar && <Sidebar />}

                            <ResizablePanelGroup
                                direction="horizontal"
                                className="w-full     "
                            >
                                {uiState.sideSection != "none" && (
                                    <ResizablePanel minSize={28}>
                                        {uiState.sideSection ==
                                            "file-explorer" && <FileExplorer />}
                                    </ResizablePanel>
                                )}
                                <ResizableHandle className="hover:bg-primary transition-all border-none bg-transparent " />

                                <ResizablePanel className="bg-background">
                                    {/* <CreateDir /> */}
                                    {/* <Button
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
                    </Button> */}

                                    {uiState.section == "note-manager" && (
                                        <div>
                                            <TabbedView />
                                        </div>
                                    )}
                                    {uiState.section == "note-viewer" && (
                                        <div className="mt-7 w-full ">
                                            <MainPage />
                                        </div>
                                    )}
                                    {/* <ThemeSelector /> */}
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
                            {/* <MainDialog /> */}
                            <MainDialog />
                        </div>
                    )}
                    <Toaster />
                    <CommandPalette />
                    <CommandBox />
                    <FileSearchBox />
                </div>
            </TooltipProvider>
        </ThemeProvider>
    );
}

export default App;
