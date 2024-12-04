import { useHotkeys } from "react-hotkeys-hook"
import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import { useFullscreen } from "~/hooks/use-fullscreen"

export default function useFullscreenShortcut() {
  const { toggleFullscreen } = useFullscreen()
  const toggleFullscreenShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_FULLSCREEN
  )

  useHotkeys(
    toggleFullscreenShortcut?.hotkeys.join(",") ?? "",
    () => {
      toggleFullscreen()
    },
    {
      enabled: toggleFullscreenShortcut?.enabled ?? false,
    }
  )

  return null
}