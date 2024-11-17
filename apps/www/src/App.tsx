import { Toaster } from "@repo/ui/components/ui/toaster";

import { StyleProvider } from "./providers/style-provider";
import MainPage from "./components/main-page";

function App() {
    return (
        <>
            <StyleProvider />
            <MainPage />
            <Toaster />
        </>
    );
}

export default App;
