import { Toaster } from "@repo/ui/components/ui/toaster";

import { StyleProvider } from "@repo/ui/providers/style-provider";
import MainPage from "@repo/ui/components/main-page";

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
