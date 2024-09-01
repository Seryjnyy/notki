import {
    BoxIcon,
    Cross1Icon,
    LaptopIcon,
    MagnifyingGlassIcon,
    MinusIcon,
    ViewVerticalIcon,
} from "@radix-ui/react-icons";
import { appWindow } from "@tauri-apps/api/window";
import { produce } from "immer";
import { ReactNode } from "react";
import { useUiState } from "~/lib/ui-store";

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

const SidebarButton = () => {
    const uiState = useUiState((state) => state.uiState);
    const setUiState = useUiState((state) => state.setUiState);

    const onToggle = () => {
        setUiState(
            produce(uiState, (draft) => {
                draft.sidebar = !draft.sidebar;
            })
        );
    };

    return (
        <div
            className="inline-flex justify-center items-center h-[30px] w-12 p-1"
            onClick={onToggle}
        >
            <div className="hover:bg-primary p-1 rounded-md group">
                <ViewVerticalIcon className="text-primary group-hover:text-secondary" />
            </div>
        </div>
    );
};

const AppSectionButtons = () => {
    const uiState = useUiState((state) => state.uiState);
    const setUiState = useUiState((state) => state.setUiState);

    return (
        <div>
            <div
                className={`inline-flex justify-center items-center h-[30px] w-12 p-1 ${uiState.section == "note-viewer" ? " bg-card" : ""}`}
            >
                <div
                    className="hover:bg-primary p-1 rounded-xl group"
                    onClick={() => {
                        setUiState(
                            produce(uiState, (draft) => {
                                draft.section = "note-viewer";
                            })
                        );
                    }}
                >
                    <MagnifyingGlassIcon className="text-primary group-hover:text-secondary" />
                </div>
            </div>
            <div
                className={`inline-flex justify-center items-center h-[30px] w-12 p-1 ${uiState.section == "note-manager" ? " bg-card" : ""}`}
            >
                <div
                    className="hover:bg-primary p-1 rounded-xl group"
                    onClick={() => {
                        setUiState(
                            produce(uiState, (draft) => {
                                draft.section = "note-manager";
                            })
                        );
                    }}
                >
                    <LaptopIcon className="text-primary group-hover:text-secondary" />
                </div>
            </div>
        </div>
    );
};

export default function Titlebar() {
    const uiState = useUiState((state) => state.uiState);

    if (!uiState.titlebar) return <></>;

    return (
        <div
            data-tauri-drag-region
            className="select-none h-[30px] flex justify-between fixed top-0 left-0 right-0 bg-secondary z-10 "
        >
            <div className="flex ">
                <SidebarButton />
                <AppSectionButtons />
            </div>

            <div>
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
    );
}
