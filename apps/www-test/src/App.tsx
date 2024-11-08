import Footer from "@repo/ui/footer";
import MainPage from "@repo/ui/main-page";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { Toaster } from "@repo/ui/toaster";
import { TooltipProvider } from "@repo/ui/tooltip";
import NoteCard from "./components/compound-ui/note-card";
import NoteMap from "./components/note-map-dialog";
import { SettingsDialog } from "./components/settings/settings-dialog";
import { ThemeSwitcherList } from "./components/theme-switcher-list";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="pt-4">
                    <TooltipProvider>
                        <div className="my-20 mx-20">
                            <NoteCard
                                handleDelete={() => {}}
                                note={{
                                    characterCount: 2452,
                                    content: "lorem ipsum some text and stuff.",
                                    fileName: "someFile",
                                    id: "fjdsio32",
                                    lastModified: Date.now(),
                                    size: 43536,
                                }}
                            />
                        </div>
                        <MainPage />
                        <NoteMap />
                        <ThemeSwitcherList />
                        <SettingsDialog />
                        <Footer />
                    </TooltipProvider>
                </div>
                <Toaster />
            </ThemeProvider>
        </>
    );
}

export default App;
