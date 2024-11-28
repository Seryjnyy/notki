import { DialogTitle } from "@radix-ui/react-dialog"
import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import { TabButton } from "@repo/ui/components/settings/tab-button"
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys"
import { Button } from "@repo/ui/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible"
import { DialogContent } from "@repo/ui/components/ui/dialog"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { Tabs, TabsContent } from "@repo/ui/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { useNavigationLock } from "@repo/ui/hooks/use-navigation-lock"
import { cn } from "@repo/ui/lib/utils"
import { atom, useAtom } from "jotai"
import { MenuIcon, SettingsIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog-controlled"

const settingsDialogOpenAtom = atom(false)
const useSettingsDialogOpen = () => {
  const [open, setOpen] = useAtom(settingsDialogOpenAtom)
  const { disableNavigation, enableNavigation } = useNavigationLock()

  return [
    open,
    (newOpen: boolean) => {
      if (newOpen) {
        disableNavigation()
      } else {
        enableNavigation()
      }
      setOpen(newOpen)
    },
  ] as const
}

export const SettingsDialog = ({
  settingTabs,
}: {
  settingTabs: {
    label: string
    icon: JSX.Element
    comp: JSX.Element
  }[]
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useSettingsDialogOpen()
  // Problem when 0 tabs, but shouldn't happen
  const [currentTab, setCurrentTab] = useState(settingTabs[0]!.label)

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogContent className="flex h-[90vh] sm:h-3/4 flex-col sm:flex-row w-full max-w-5xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            This is where you can change various aspects of the app.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-full w-fit hidden sm:block">
          <h2 className="mb-4 text-2xl font-bold">Settings</h2>
          <div className="flex w-[12rem] flex-col gap-2">
            {settingTabs.map((tab) => (
              <TabButton
                key={tab.label}
                label={tab.label}
                icon={tab.icon}
                isActive={currentTab === tab.label}
                setCurrentTab={setCurrentTab}
              />
            ))}
          </div>
        </div>
        <Collapsible
          open={isMobileMenuOpen}
          onOpenChange={setIsMobileMenuOpen}
          className={cn(
            "mt-4 pt-1 px-2  sm:hidden",
            isMobileMenuOpen && "border-t  border-b backdrop-brightness-95"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger className="mb-2" asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    {!isMobileMenuOpen ? <MenuIcon /> : <XIcon />}
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isMobileMenuOpen ? "Close menu" : "Open menu"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CollapsibleContent className="pb-2">
            <div className="flex flex-wrap gap-1">
              {settingTabs.map((tab) => (
                <TabButton
                  key={tab.label}
                  label={tab.label}
                  icon={tab.icon}
                  isActive={currentTab === tab.label}
                  setCurrentTab={setCurrentTab}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex flex-1 flex-col">
          <h2 className="mb-4 text-xl font-bold">{currentTab}</h2>
          <ScrollArea className="w-full overflow-y-auto h-[70vh] sm:h-full">
            <Tabs
              className="pb-8 pl-1 pr-4"
              value={currentTab}
              orientation="vertical"
              defaultValue="font"
            >
              {settingTabs.map(({ label, comp }) => {
                return (
                  <TabsContent key={label} value={label}>
                    {comp}
                  </TabsContent>
                )
              })}
            </Tabs>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const SettingsDialogHotkeyTrigger = () => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useSettingsDialogOpen()
  const toggleSettingsShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_SETTINGS
  )

  useHotkeys(
    toggleSettingsShortcut?.hotkeys.join(",") ?? "",
    () => {
      setSettingsDialogOpen(!settingsDialogOpen)
    },
    { enabled: toggleSettingsShortcut?.enabled ?? false }
  )
  return null
}

export const SettingsDialogButtonTrigger = () => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useSettingsDialogOpen()
  const toggleSettingsShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_SETTINGS
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            variant="secondary"
            className="group gap-2 p-2"
            onClick={() => {
              setSettingsDialogOpen(!settingsDialogOpen)
            }}
          >
            <SettingsIcon className="text-muted-foreground/60  group-hover:animate-spinOnce group-hover:text-accent-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>
            Settings
            <TooltipShortcutKeys shortcut={toggleSettingsShortcut} />
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
