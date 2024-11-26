import NoteNav from "./note-nav"
import Toolbar from "./toolbar"
import { useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { cn } from "@repo/ui/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { Button } from "@repo/ui/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cva, VariantProps } from "class-variance-authority"
import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys"

const bottomBarVariants = cva(
  "flex justify-center items-center flex-col w-full",
  {
    variants: {
      variant: {
        normal: "",
        fixed: "bottom-0 left-0 fixed",
        absolute: "bottom-0 left-0 absolute",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  }
)

interface BottomNavBarProps extends VariantProps<typeof bottomBarVariants> {}

export default function BottomBar({ variant }: BottomNavBarProps) {
  const [hideToolbar, setHideToolbar] = useState(false)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const toggleBottomBarShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_BOTTOM_BAR
  )

  useHotkeys(
    toggleBottomBarShortcut?.hotkeys.join(",") ?? "",
    () => {
      setHideToolbar((prev) => !prev)
    },
    {
      enabled: toggleBottomBarShortcut?.enabled ?? false,
    }
  )

  return (
    <div
      className={cn(
        bottomBarVariants({ variant }),
        hideToolbar && "flex-col-reverse"
      )}
    >
      <div className={"flex justify-center w-full pb-1"}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setHideToolbar(!hideToolbar)}
                size="icon"
                variant={"secondary"}
                id={!hideToolbar ? undefined : "main-nav"}
              >
                {hideToolbar ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {hideToolbar ? "Open" : "Close"} toolbar
                <TooltipShortcutKeys shortcut={toggleBottomBarShortcut} />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        aria-hidden={hideToolbar}
        className={cn(
          "flex  border-t border-l rounded-t-[var(--radius)] backdrop-blur-md border-r  w-fit flex-wrap",
          hideToolbar && " invisible"
        )}
        tabIndex={-1}
        id={hideToolbar ? undefined : "main-nav"}
        ref={toolbarRef}
      >
        <div className="z-50  p-2  w-full ">
          <Toolbar />
        </div>
        <div className="  p-2 w-fit mx-auto">
          <NoteNav />
        </div>
      </div>
    </div>
  )
}
