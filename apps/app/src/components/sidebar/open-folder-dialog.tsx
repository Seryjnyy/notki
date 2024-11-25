import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import { useUploadSettingsStore } from "@repo/lib/stores/upload-file-settings-store"
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys"
import { Button } from "@repo/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog"
import { Label } from "@repo/ui/components/ui/label"
import { RadioCard, RadioCardTitle } from "@repo/ui/components/ui/radio-card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { useNavigationLock } from "@repo/ui/hooks/use-navigation-lock"
import { atom, useAtom } from "jotai"
import { DoorOpen } from "lucide-react"
import { useMemo } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { OpenFolderButton, OpenFolderSettings } from "../landing/open-folder"
import * as React from "react"
import { cn } from "@repo/ui/lib/utils"

const openFolderDialogOpenAtom = atom(false)
const useOpenFolderDialogOpen = () => {
  const [open, setOpen] = useAtom(openFolderDialogOpenAtom)
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

export const OpenFolderDialogTrigger = ({
  className,
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [open, setOpen] = useOpenFolderDialogOpen()
  const toggleOpenFolderShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_OPEN_FOLDER
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn("flex items-center gap-2", className)}
            onClick={() => setOpen(!open)}
          >
            <DoorOpen /> Open folder
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Add notes from folder{" "}
            <TooltipShortcutKeys shortcut={toggleOpenFolderShortcut} />
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const OpenFolderDialogShortcut = () => {
  const [open, setOpen] = useOpenFolderDialogOpen()
  const shortcut = useShortcutInfo(AVAILABLE_SHORTCUTS.TOGGLE_OPEN_FOLDER)

  useHotkeys(
    shortcut?.hotkeys.join(",") ?? "",
    () => {
      setOpen(!open)
    },
    { enabled: shortcut?.enabled ?? false }
  )

  return null
}

export default function OpenFolderDialog() {
  const [open, setOpen] = useOpenFolderDialogOpen()

  // Idk if to use uploadSettings for this or keep it separate
  const setReplace = useUploadSettingsStore.use.setReplace()
  const replace = useUploadSettingsStore.use.replace()
  // const [addBy, setAddBy] = useState<AddBy>("replace");

  const addByOptions = ["add", "replace"] as const
  const addBy = useMemo(() => (replace ? "replace" : "add"), [replace])

  // Its a dialog instead of navigation aware dialog because it wasn't working properly with it, instead the hook to set the atom manages locking and unlocking note navigation
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open folder</DialogTitle>
          <DialogDescription className="sr-only">
            This will open the folder or folders you select and add or replace
            the notes.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <div className="pb-8 space-y-6">
            <div>
              <Label>Options</Label>
              <div className="flex pt-2">
                <OpenFolderSettings />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Add notes by</Label>

              <div className="grid grid-cols-2 gap-2">
                {addByOptions.map((option) => (
                  <RadioCard
                    isActive={addBy == option}
                    onClick={() => setReplace(option === "replace")}
                    key={option}
                  >
                    <RadioCardTitle className="capitalize">
                      {option}
                    </RadioCardTitle>
                  </RadioCard>
                ))}
              </div>
            </div>
          </div>

          <div className="flex  flex-col">
            <div className="w-full">
              <OpenFolderButton
                className="w-full"
                replace={addBy === "replace"}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
