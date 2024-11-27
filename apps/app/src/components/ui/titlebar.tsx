import { BoxIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons"
import { appWindow } from "@tauri-apps/api/window"
import { ReactNode } from "react"

interface WindowActionButtonProps {
  children: ReactNode
  action: () => Promise<void>
}
const WindowActionButton = ({ children, action }: WindowActionButtonProps) => {
  return (
    <div
      className="inline-flex justify-center items-center h-[30px] w-[30px] hover:bg-primary group"
      onClick={action}
    >
      <span className="text-primary group-hover:text-secondary">
        {children}
      </span>
    </div>
  )
}

export default function Titlebar() {
  return (
    <div
      data-tauri-drag-region
      className="select-none h-[30px] flex justify-between   w-full z-[200] brightness-125"
    >
      {/*<div>*/}
      {/*  <div className="flex items-center justify-center flex-col text-primary  h-full text-xs">*/}
      {/*    <span>Workspace</span>*/}
      {/*    /!* <span>*/}
      {/*                  C:/Users/Documents/example/path/thenSome/thenThere/Thenhere*/}
      {/*              </span> *!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="ml-auto">
        <WindowActionButton action={() => appWindow.minimize()}>
          <MinusIcon className="" />
        </WindowActionButton>

        <WindowActionButton action={() => appWindow.toggleMaximize()}>
          <BoxIcon />
        </WindowActionButton>

        <WindowActionButton action={() => appWindow.close()}>
          <Cross1Icon />
        </WindowActionButton>
      </div>
    </div>
  )
}
