import DropZone from "./DropZone";
import Notes from "./Notes";
import { ThemeProvider } from "./components/theme-provider";
import Footer from "./components/ui/footer";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="flex flex-col mx-auto items-center  min-h-screen py-12 ">
        <header>
          <h1 className="sr-only">Txt viewer</h1>
        </header>

        <div className="space-y-[4rem] w-full">
          <section className="w-3/4 mx-auto">
            <h2 className="text-muted-foreground text-center text-sm">
              ADD TXT FILES
            </h2>
            <DropZone />
          </section>

          <section className="w-full px-2 md:px-8 h-fit">
            <h2 className="text-muted-foreground text-center text-sm">
              YOUR NOTES
            </h2>
            <Notes />
          </section>
        </div>
      </main>
      <Toaster />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
