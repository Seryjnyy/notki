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
import NewVault from "./components/ui/vault-manager";
import Sidebar from "./components/ui/sidebar";
import TabbedView from "./components/ui/tabbed-view";
import Titlebar from "./components/ui/titlebar";

import CommandBox from "./components/ui/command-box";
import FileSearchBox from "./components/ui/file-search-box";
import { useUiState } from "./lib/ui-store";
import { useWorkspaceConfig } from "./lib/workspace-store";
import { produce } from "immer";
import NoteTakingPage from "./components/note-taking-page";
import MinimalTitlebar from "./components/ui/minimal-titlebar";

function App() {
    // TODO : Should probably in component to reduce rerendering everything, or does zustand prevent that, I can't remember
    const uiState = useUiState.use.uiState();
    const setUiState = useUiState.use.setUiState();
    const workspace = useWorkspaceConfig.use.currentWorkspace();
    // const setWorkspacePath = useWorkspaceConfig(
    //     (state) => state.setCurrentWorkspace
    // );

    useEffect(() => {
        const setUp = async () => {
            // const res = await invoke("get_current_workspace");
            // if (typeof res == "string") {
            // TODO : Check if actual directory
            // TODO : Check if have access to it
            // const config = JSON.parse(res) as WorkspaceConfig;
            // console.log("getting workspace", config.currentWorkspace);
            // if (config.currentWorkspace == "") {
            //     return;
            // }
            // setWorkspacePath(config.currentWorkspace);
            // }
            if (!workspace) {
                setUiState(
                    produce(uiState, (draft) => {
                        draft.section = "vault-manager";
                    })
                );
            } else {
                console.log("there is a workspace");
                setUiState(
                    produce(uiState, (draft) => {
                        draft.section = "note-manager";
                    })
                );
            }
        };

        setUp();
    }, []);

    useEffect(() => {
        if (workspace) {
            setUiState(
                produce(uiState, (draft) => {
                    draft.section = "note-manager";
                })
            );
        } else {
            setUiState(
                produce(uiState, (draft) => {
                    draft.section = "vault-manager";
                })
            );
        }
    }, [workspace]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <div className={` w-full h-screen flex flex-col  pt-7`}>
                    <Titlebar />
                    {/* <MinimalTitlebar /> */}
                    {uiState.section == "vault-manager" && <NewVault />}
                    {uiState.section == "note-viewer" ||
                        (uiState.section == "note-manager" && (
                            <div className="h-screen overflow-hidden flex  ">
                                {uiState.sidebar && <Sidebar />}

                                <ResizablePanelGroup
                                    direction="horizontal"
                                    className="w-full     "
                                >
                                    {uiState.sideSection != "none" && (
                                        <ResizablePanel minSize={28}>
                                            {uiState.sideSection ==
                                                "file-explorer" && (
                                                <FileExplorer />
                                            )}
                                        </ResizablePanel>
                                    )}
                                    <ResizableHandle className="hover:bg-primary transition-all border-none bg-transparent " />

                                    <ResizablePanel className="bg-background">
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
                                    </ResizablePanel>
                                </ResizablePanelGroup>

                                <MainDialog />
                            </div>
                        ))}
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
