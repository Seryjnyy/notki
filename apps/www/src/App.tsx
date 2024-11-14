import Footer from "@repo/ui/components/ui/footer";
import MainPage from "@repo/ui/components/ui/sections/main-page";
import ModeToggle from "@repo/ui/components/mode-toggle";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@repo/ui/components/ui/toaster";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="pt-4">
                    <MainPage />
                    <ModeToggle />
                    <Footer />
                </div>
                <Toaster />
            </ThemeProvider>
        </>
    );
}

export default App;
