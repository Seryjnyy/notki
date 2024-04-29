import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";

import DropZone from "./DropZone";
import Notes from "./Notes";
import { ThemeProvider } from "./components/theme-provider";

import { ExclamationTriangleIcon, UpdateIcon } from "@radix-ui/react-icons";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./components/ui/button";
import Footer from "./components/ui/footer";
import { Toaster } from "./components/ui/toaster";
import { removePreferences } from "./services/preferences";

function App() {
  const onResetPreferences = () => {
    removePreferences();
    window.location.reload();
  };

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
            <ErrorBoundary
              fallback={
                <div className="flex flex-col gap-4 pt-8">
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Something went wrong</AlertTitle>
                    <AlertDescription>
                      Refresh the page, if error persists try resetting <br />
                      preferences. If nothing works please let me know.
                    </AlertDescription>
                  </Alert>
                  <Button className="space-x-2" onClick={onResetPreferences}>
                    <span>Reset preferences</span> <UpdateIcon />
                  </Button>
                </div>
              }
            >
              <Notes />
            </ErrorBoundary>
          </section>
        </div>
      </main>
      <Toaster />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
