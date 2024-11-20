import { Toaster } from "@repo/ui/components/ui/toaster";

import { StyleProvider } from "@repo/ui/providers/style-provider";
import MainPage from "@repo/ui/components/main-page";
import {
    SettingsDialog,
    SettingsDialogHotkeyTrigger,
} from "@repo/ui/components/settings/settings-dialog";

function App() {
    return (
        <>
            <StyleProvider />
            <MainPage />
            <SettingsDialog />
            <SettingsDialogHotkeyTrigger />
            <Toaster />
        </>
    );
}

export default App;
