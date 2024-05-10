import {
  BoxIcon,
  CropIcon,
  Cross1Icon,
  MinusIcon,
} from "@radix-ui/react-icons";
import { appWindow } from "@tauri-apps/api/window";
import { ReactNode } from "react";

interface WindowActionButtonProps {
  children: ReactNode;
  action: () => Promise<void>;
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
  );
};

export default function Titlebar() {
  return (
    <div
      data-tauri-drag-region
      className="select-none h-[30px] flex justify-end fixed top-0 left-0 right-0 bg-secondary"
    >
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
  );
}
