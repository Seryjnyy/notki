import Footer from "@repo/ui/footer";
import MainPage from "@repo/ui/main-page";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { Toaster } from "@repo/ui/toaster";
import Titlebar from "./components/ui/titlebar";
import { ScrollArea } from "@repo/ui/scroll-area";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Titlebar />
        <div className="h-screen overflow-hidden">
          <ScrollArea className="mt-[30px] h-screen">
            <MainPage />
            <Footer />
          </ScrollArea>
        </div>

        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
