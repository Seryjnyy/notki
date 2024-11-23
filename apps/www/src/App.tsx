import { Toaster } from "@repo/ui/components/ui/toaster";

import { StyleProvider } from "@repo/ui/providers/style-provider";
import MainPage from "@repo/ui/components/main-page";
import {
    SettingsDialog,
    SettingsDialogHotkeyTrigger,
} from "@repo/ui/components/settings/settings-dialog";
import { SETTINGS_TABS } from "@repo/ui/components/settings/setting-tabs";

function App() {
    return (
        <>
            <StyleProvider />
            <MainPage />
            <SettingsDialog settingTabs={SETTINGS_TABS} />
            <SettingsDialogHotkeyTrigger />
            <Toaster />
        </>
    );
}

export default App;
