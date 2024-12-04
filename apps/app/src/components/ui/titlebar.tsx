import { BoxIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons"
import { appWindow } from "@tauri-apps/api/window"
import { ReactNode } from "react"
import { useFullscreen } from "~/hooks/use-fullscreen"
import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/ui/button"

interface WindowActionButtonProps {
  children: ReactNode
  action: () => Promise<void>
}
const WindowActionButton = ({ children, action }: WindowActionButtonProps) => {
  return (
    <Button
      className="inline-flex justify-center items-center h-[30px] w-[30px] hover:bg-primary group rounded-none"
      onClick={action}
      variant={"ghost"}
    >
      <span className="text-primary group-hover:text-secondary">
        {children}
      </span>
    </Button>
  )
}

const WindowActions = () => {
  return (
    <>
      <WindowActionButton action={() => appWindow.minimize()}>
        <MinusIcon className="" />
      </WindowActionButton>

      <WindowActionButton action={() => appWindow.toggleMaximize()}>
        <BoxIcon />
      </WindowActionButton>

      <WindowActionButton action={() => appWindow.close()}>
        <Cross1Icon />
      </WindowActionButton>
    </>
  )
}

export default function Titlebar() {
  const { isFullscreen } = useFullscreen()

  if (isFullscreen)
    return (
      <div className="select-none h-[30px] flex justify-between w-full z-[200] brightness-125">
        <div
          className={cn(
            "ml-auto",
            isFullscreen &&
              "opacity-0  focus-within:opacity-100 hover:opacity-100"
          )}
        >
          <WindowActions />
        </div>
      </div>
    )

  return (
    <div
      data-tauri-drag-region
      className="select-none h-[30px] flex justify-between   w-full z-[200] brightness-125 "
    >
      <div className={"ml-auto"}>
        <WindowActions />
      </div>
    </div>
  )
}
