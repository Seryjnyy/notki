import { ExclamationTriangleIcon, UpdateIcon } from "@radix-ui/react-icons";
import { removePreferences } from "@repo/lib/services/preferences-service";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "../alert";
import { Button } from "../button";
import DropZone from "./drop-zone";
import Notes from "./notes";

// TODO : Deprecated, remove
export default function MainPage() {
    const onResetPreferences = () => {
        removePreferences();
        window.location.reload();
    };

    return (
        <div className="bg-background">
            <header>
                <h1 className="sr-only">Txt viewer</h1>
            </header>
            <main className="flex flex-col mx-auto items-center min-h-screen ">
                <div className="space-y-[4rem] w-full">
                    <section className="w-3/4 mx-auto">
                        <h2 className="text-muted-foreground text-center text-sm">
                            ADD TXT FILES
                        </h2>
                        <DropZone />
                    </section>

                    <section className="w-full h-fit">
                        <h2 className="text-muted-foreground text-center text-sm">
                            YOUR NOTES
                        </h2>
                        <ErrorBoundary
                            fallback={
                                <div className="flex flex-col gap-4 pt-8">
                                    <Alert variant="destructive">
                                        <ExclamationTriangleIcon className="h-4 w-4" />
                                        <AlertTitle>
                                            Something went wrong
                                        </AlertTitle>
                                        <AlertDescription>
                                            Refresh the page, if error persists
                                            try resetting <br />
                                            preferences. If nothing works please
                                            let me know.
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        className="space-x-2"
                                        onClick={onResetPreferences}
                                    >
                                        <span>Reset preferences</span>{" "}
                                        <UpdateIcon />
                                    </Button>
                                </div>
                            }
                        >
                            <Notes />
                        </ErrorBoundary>
                    </section>
                </div>
            </main>
        </div>
    );
}
