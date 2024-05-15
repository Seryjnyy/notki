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

function App() {
  // TODO : Should probably in component to reduce rerendering everything, or does zustand prevent that, I can't remember
  const uiState = useUiState((state) => state.uiState);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Titlebar />
        {/* <MinimalTitlebar /> */}
        <div className="h-screen overflow-hidden flex">
          {uiState.sidebar && <Sidebar />}
          <ScrollArea className="mt-[30px] h-screen w-full">
            {/* <MainPage />
            <Footer /> */}
            {/* <CreateDir /> */}
            {/* <AutoSave /> */}
            <NewVault />
            {/* <NoteTakingPage /> */}
          </ScrollArea>
        </div>

        <Toaster />
        <CommandBox />
      </ThemeProvider>
    </>
  );
}

export default App;
