import { Setting } from "@repo/ui/components/settings/setting"
import { Button } from "@repo/ui/components/ui/button"
import { Fullscreen } from "lucide-react"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/ui/tooltip"
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys"
import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import { useFullscreen } from "~/hooks/use-fullscreen"

export const WindowTab = () => {
  return (
    <Setting
      title="Appearance"
      description="Changes related to the appearance of the window."
      // resetAction={reset}
    >
      <FullscreenButton />
    </Setting>
  )
}

const FullscreenButton = () => {
  const toggleFullscreenShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_FULLSCREEN
  )
  const { toggleFullscreen } = useFullscreen()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className={"w-full"} onClick={toggleFullscreen}>
            <Fullscreen className={"size-4 mr-2"} /> Toggle fullscreen
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"bottom"}>
          <p>
            Toggle fullscreen{" "}
            <TooltipShortcutKeys shortcut={toggleFullscreenShortcut} />
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
