import { ArchiveIcon, FileIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import ModeToggle from "@repo/ui/components/mode-toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { produce } from "immer";
import { ReactNode } from "react";
import { useUiState } from "~/lib/ui-store";

interface SidebarButtonInterface {
    children: ReactNode;
    tooltip: string;
    active?: boolean;
    action?: () => void;
}

const SidebarTooltip = ({
    children,
    content,
}: {
    children: ReactNode;
    content: string;
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={1000}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right">
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const SidebarButton = ({
    children,
    tooltip,
    active,
    action,
}: SidebarButtonInterface) => {
    return (
        <SidebarTooltip content={tooltip}>
            <Button
                variant="ghost"
                className={`rounded-none text-primary  ${active ? "border-primary border-l" : ""}`}
                onClick={() => {
                    if (action) {
                        action();
                    }
                }}
            >
                {children}
            </Button>
        </SidebarTooltip>
    );
};

export default function Sidebar() {
    const uiState = useUiState((state) => state.uiState);
    const setUiState = useUiState((state) => state.setUiState);

    return (
        <div className="w-12 h-screen pt-8 bg-secondary">
            <div className="flex flex-col h-full ">
                <SidebarButton
                    tooltip="File manager"
                    active={uiState.sideSection == "file-explorer"}
                    action={() =>
                        setUiState(
                            produce(uiState, (draft) => {
                                if (uiState.sideSection == "file-explorer") {
                                    draft.sideSection = "none";
                                } else {
                                    draft.sideSection = "file-explorer";
                                }
                            })
                        )
                    }
                >
                    <FileIcon className="w-4 h-4" />
                </SidebarButton>

                {/* <div className="flex justify-center items-center relative">
          {uiState.section == "note-manager" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button className="" variant="ghost" onClick={() => setUiState(produce(uiState, draft => {
            draft.sidebarActive = 
          }))}>
            m<FileIcon className="w-4 h-4" />
          </Button>
        </div> */}
                {/* <div className="flex justify-center items-center relative">
          {uiState.section == "note-viewer" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button className="" variant="ghost">
            v<FileIcon className="w-4 h-4" />
          </Button>
        </div> */}
                <SidebarButton
                    action={() =>
                        setUiState(
                            produce(uiState, (draft) => {
                                draft.settings = !draft.settings;
                            })
                        )
                    }
                    active={uiState.settings}
                    tooltip="Settings"
                >
                    <GearIcon className="w-4 h-4" />
                </SidebarButton>
                <SidebarTooltip content="Dark/Light mode">
                    <div>
                        <ModeToggle />
                    </div>
                </SidebarTooltip>
                <SidebarTooltip content="Vaults">
                    <Button
                        variant={"ghost"}
                        onClick={() => {
                            setUiState(
                                produce(uiState, (draft) => {
                                    draft.section = "vault-manager";
                                })
                            );
                        }}
                    >
                        <ArchiveIcon />
                    </Button>
                </SidebarTooltip>
            </div>
        </div>
    );
}
