import Footer from "@repo/ui/footer";
import MainPage from "@repo/ui/main-page";
import ModeToggle from "@repo/ui/mode-toggle";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { Toaster } from "@repo/ui/toaster";

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
