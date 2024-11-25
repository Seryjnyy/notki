import { SETTINGS_TABS } from "@repo/ui/components/settings/setting-tabs";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { useMemo } from "react";
import Titlebar from "./components/ui/titlebar";

import CommandBox from "./components/ui/command-box";
import FileSearchBox from "./components/ui/file-search-box";

import { useShortcutsStore } from "@repo/lib/stores/shortcuts-store";
import {
    SettingsDialog,
    SettingsDialogHotkeyTrigger,
} from "@repo/ui/components/settings/settings-dialog";
import ShortcutTab from "@repo/ui/components/settings/shortcut-tab/shortcut-tab";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { StyleProvider } from "@repo/ui/providers/style-provider";
import MainPage from "./components/main-page-pc";
import { AppSidebar } from "./components/sidebar/app-sidebar";
import AppSidebarTrigger from "./components/sidebar/app-sidebar-trigger";
import OpenFolderDialog, {
    OpenFolderDialogShortcut,
} from "./components/sidebar/open-folder-dialog";

function App() {
    // TODO : Should probably in component to reduce rerendering everything, or does zustand prevent that, I can't remember
    // const uiState = useUiState.use.uiState();
    // const setUiState = useUiState.use.setUiState();
    // const workspace = useWorkspaceConfig.use.currentWorkspace();
    // const setWorkspacePath = useWorkspaceConfig(
    //     (state) => state.setCurrentWorkspace
    // );
    const pcExclusiveShortcuts = useShortcutsStore.use.pcExclusiveShortcuts();

    // useEffect(() => {
    //     const setUp = async () => {
    //         const res = await invoke("get_current_workspace");
    //         if (typeof res == "string") {
    //         TODO : Check if actual directory
    //         TODO : Check if have access to it
    //         const config = JSON.parse(res) as WorkspaceConfig;
    //         console.log("getting workspace", config.currentWorkspace);
    //         if (config.currentWorkspace == "") {
    //             return;
    //         }
    //         setWorkspacePath(config.currentWorkspace);
    //         }
    //         if (!workspace) {
    //             setUiState(
    //                 produce(uiState, (draft) => {
    //                     draft.section = "vault-manager";
    //                 })
    //             );
    //         } else {
    //             console.log("there is a workspace");
    //             setUiState(
    //                 produce(uiState, (draft) => {
    //                     draft.section = "note-manager";
    //                 })
    //             );
    //         }
    //     };

    //     setUp();
    // }, []);

    // useEffect(() => {
    //     if (workspace) {
    //         setUiState(
    //             produce(uiState, (draft) => {
    //                 draft.section = "note-manager";
    //             })
    //         );
    //     } else {
    //         setUiState(
    //             produce(uiState, (draft) => {
    //                 draft.section = "vault-manager";
    //             })
    //         );
    //     }
    // }, [workspace]);

    const interceptedSettingTabs = useMemo(() => {
        const shortcutsTab = SETTINGS_TABS.find(
            (tab) => tab.id === "shortcuts"
        );

        if (!shortcutsTab) return SETTINGS_TABS;

        const newShortcutsTab = {
            ...shortcutsTab,
            comp: <ShortcutTab extraShortcuts={pcExclusiveShortcuts} />,
        };

        return [
            ...SETTINGS_TABS.filter((tab) => tab.id !== "shortcuts"),
            newShortcutsTab,
        ];
    }, [SETTINGS_TABS, pcExclusiveShortcuts]);

    return (
        <div>
            <StyleProvider />

            <div className={` w-full  flex flex-col  `}>
                {/* <MinimalTitlebar /> */}
                {/* {uiState.section == "vault-manager" && <NewVault />} */}
                {/* {(uiState.section == "note-viewer" ||
                    uiState.section == "note-manager") && (
                    <div className="h-screen overflow-hidden flex  ">
                        {uiState.sidebar && <Sidebar />}

                        <ResizablePanelGroup
                            direction="horizontal"
                            className="w-full     "
                        >
                            {uiState.sideSection != "none" && (
                                <ResizablePanel
                                    minSize={28}
                                    id="file-explorer"
                                    order={1}
                                >
                                    {uiState.sideSection == "file-explorer" && (
                                        <FileExplorer />
                                    )}
                                </ResizablePanel>
                            )}
                            <ResizableHandle className="hover:bg-primary transition-all border-none bg-transparent " />

                            <ResizablePanel
                                className="bg-background border-l border-secondary"
                                id="main-content"
                                order={2}
                            >
                                {uiState.section == "note-manager" && (
                                    <div>
                                        <TabbedView />
                                    </div>
                                )}
                                {uiState.section == "note-viewer" && (
                                    <div className="w-full ">
                                    <NoteViewer />
                                    </div>
                                    )}
                                    </ResizablePanel>
                                    </ResizablePanelGroup>
                                    
                                    <MainDialog />
                                    </div>
                                    )} */}

                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b   pl-4 z-50">
                            <AppSidebarTrigger />
                            <Titlebar />
                        </header>
                        <ScrollArea className="h-[calc(100vh-31px)]">
                            <MainPage />
                        </ScrollArea>
                    </SidebarInset>

                    <SettingsDialog settingTabs={interceptedSettingTabs} />
                    <SettingsDialogHotkeyTrigger />
                    <OpenFolderDialog />
                    <OpenFolderDialogShortcut />
                </SidebarProvider>

                <Toaster />

                <CommandBox />
                <FileSearchBox />
            </div>
        </div>
    );
}

export default App;
