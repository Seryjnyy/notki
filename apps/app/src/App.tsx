import { SETTINGS_TABS } from "@repo/ui/components/settings/setting-tabs"
import { Toaster } from "@repo/ui/components/ui/toaster"
import { useMemo } from "react"
import Titlebar from "./components/ui/titlebar"
import { useShortcutsStore } from "@repo/lib/stores/shortcuts-store"
import {
  SettingsDialog,
  SettingsDialogHotkeyTrigger,
} from "@repo/ui/components/settings/settings-dialog"
import ShortcutTab from "@repo/ui/components/settings/shortcut-tab/shortcut-tab"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar"
import { StyleProvider } from "@repo/ui/providers/style-provider"
import MainPage from "./components/main-page-pc"
import { AppSidebar } from "./components/sidebar/app-sidebar"
import AppSidebarTrigger from "./components/sidebar/app-sidebar-trigger"
import ManageVaultsDialog, {
  ManageVaultsDialogShortcut,
} from "./components/vault-manager/manage-vaults-dialog"
import OpenFolderDialog, {
  OpenFolderDialogShortcut,
} from "./components/sidebar/open-folder-dialog"
import useFullscreenShortcut from "~/hooks/use-fullscreen-shortcut"

import { AppWindow } from "lucide-react"
import { WindowTab } from "~/components/settings/window-tab/window-tab"

function App() {
  const pcExclusiveShortcuts = useShortcutsStore.use.pcExclusiveShortcuts()
  useFullscreenShortcut()

  const interceptedSettingTabs = useMemo(() => {
    const shortcutsTab = SETTINGS_TABS.find((tab) => tab.id === "shortcuts")

    if (!shortcutsTab) return SETTINGS_TABS

    const newShortcutsTab = {
      ...shortcutsTab,
      comp: <ShortcutTab extraShortcuts={pcExclusiveShortcuts} />,
    }

    const windowTab = {
      id: "window",
      label: "Window",
      icon: <AppWindow className="h-4 w-4" />,
      comp: <WindowTab />,
    }

    return [
      ...SETTINGS_TABS.filter((tab) => tab.id !== "shortcuts"),
      newShortcutsTab,
      windowTab,
    ]
  }, [pcExclusiveShortcuts])

  return (
    <div>
      <StyleProvider />

      <div className={` w-full  flex flex-col  `}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b   pl-4 z-50">
              <AppSidebarTrigger />
              <Titlebar />
            </header>
            <ScrollArea className="h-[calc(100vh-31px)]">
              <MainPage />
            </ScrollArea>
          </SidebarInset>

          <SettingsDialog settingTabs={interceptedSettingTabs} />
          <SettingsDialogHotkeyTrigger />
          <ManageVaultsDialog />
          <ManageVaultsDialogShortcut />
          <OpenFolderDialog />
          <OpenFolderDialogShortcut />
        </SidebarProvider>

        <Toaster />
      </div>
    </div>
  )
}

export default App
