import { Badge } from "@repo/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/dialog-controlled";
import { Input } from "@repo/ui/input";
import { ScrollArea } from "@repo/ui/scroll-area";

import { appWindow } from "@tauri-apps/api/window";
import { current, produce } from "immer";
import {
    createRef,
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { newFile } from "~/lib/file-services/file-service";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { UiState } from "~/lib/types";
import { useUiState } from "~/lib/ui-store";
import { cn } from "~/lib/utils";
import { useWorkspaceConfig } from "~/lib/workspace-store";

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    shortcut: React.ReactNode;
}

// TODO : focus isn't currently correct, it should work more like vs code does
const Command = forwardRef<HTMLDivElement, CommandProps>(
    ({ title, shortcut, ...props }, ref) => {
        return (
            <div
                className="py-2 text-muted-foreground flex items-center justify-between focus:ring-1 focus:ring-white rounded-md cursor-pointer hover:bg-secondary px-2"
                ref={ref}
                tabIndex={0}
                {...props}
            >
                <span>{title}</span>
                {shortcut}
            </div>
        );
    }
);

const CommandBadge = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return <Badge className={cn("text-xs px-3", className)}>{children}</Badge>;
};

const CommandList = ({
    onCommandExecution,
}: {
    onCommandExecution: () => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const uiState = useUiState((state) => state.uiState);
    const setUiState = useUiState((state) => state.setUiState);
    const searchInput = useRef<HTMLInputElement>(null);
    const [currentFocus, setCurrentFocus] = useState(-1);

    const openedTabs = useOpenedTabs((state) => state.openedTabs);
    const setCurrentTab = useOpenedTabs((state) => state.setCurrentTabId);
    const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);

    const workspace = useWorkspaceConfig.use.currentWorkspace();

    // TODO : Commands
    const commands = useMemo(() => {
        const noteCommands = [
            {
                title: "Save note",
                desc: "Saves the current note.",
                action: () => {
                    console.log("saving note");
                },
                shortcut: (
                    <>
                        <CommandBadge>Ctrl + S</CommandBadge>
                    </>
                ),
            },
        ];

        const fileCommands = [
            {
                title: "New note",
                desc: "Creates new note",
                action: async () => {
                    console.log("Creating note");
                    if (workspace) {
                        const [filename, filepath] = await newFile(
                            workspace?.filepath
                        );

                        // update tab
                        // TODO : using filename which is bad
                        setOpenedTabs(
                            produce(openedTabs, (draft) => {
                                draft.push({
                                    id: filename,
                                    title: filename,
                                    filepath: filepath,
                                    workspaceId: "no workspace id",
                                });
                            })
                        );
                        setCurrentTab(filename);
                    }
                },
                shortcut: (
                    <>
                        <CommandBadge>Ctrl + N</CommandBadge>
                    </>
                ),
            },
        ];

        const commandDialogCommands = [
            {
                title: "Open command palette",
                desc: "Opens command palette.",
                action: () => {},
                shortcut: (
                    <>
                        <CommandBadge>Ctrl + K</CommandBadge>
                    </>
                ),
            },
            {
                title: "Close command palette",
                desc: "Closes command palette.",
                action: () => {},
                shortcut: (
                    <>
                        <CommandBadge>Esc</CommandBadge>
                    </>
                ),
            },
        ];

        const uiCommands = [
            {
                title: "Change to note manager",
                desc: "Changes view to note manager.",
                action: async (currUiState: UiState) => {
                    setUiState(
                        produce(uiState, (draft) => {
                            draft.section = "note-manager";
                        })
                    );
                },
                shortcut: (
                    <>
                        <CommandBadge>Ctrl + idk</CommandBadge>
                    </>
                ),
            },
            {
                title: "Change to note viewer",
                desc: "Changes view to note viewer.",
                action: async (currUiState: UiState) => {
                    setUiState(
                        produce(uiState, (draft) => {
                            draft.section = "note-viewer";
                        })
                    );
                },
                shortcut: (
                    <>
                        <CommandBadge>Ctrl + idk</CommandBadge>
                    </>
                ),
            },
        ];

        const workspaceCommands = [
            {
                title: "Change workspace",
                desc: "Chose which workspace you want to use.",
                action: async (currUiState: UiState) => {
                    setUiState(
                        produce(uiState, (draft) => {
                            draft.section = "note-manager";
                        })
                    );
                },
                shortcut: (
                    <>
                        <CommandBadge>Ctrl + idk</CommandBadge>
                    </>
                ),
            },
        ];

        return [
            ...fileCommands,
            ...noteCommands,
            ...uiCommands,
            ...commandDialogCommands,
            ...workspaceCommands,
            {
                title: "Minimise window",
                desc: "Minimises the window.",
                action: () => {
                    appWindow.minimize();
                },
                shortcut: <></>,
            },
            {
                title: "Maximise window",
                desc: "Maximises the window.",
                action: () => {
                    appWindow.maximize();
                },
                shortcut: <></>,
            },
            {
                title: "Close window",
                desc: "Closes the window.",
                action: () => {
                    appWindow.close();
                },
                shortcut: <></>,
            },
            {
                title: "Toggle titlebar",
                desc: "Hide or show the titlebar",
                action: (currUiState: UiState) => {
                    setUiState(
                        produce(uiState, (draft) => {
                            draft.titlebar = !currUiState.titlebar;
                        })
                    );
                },
                shortcut: <></>,
            },
        ];
    }, []);

    const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        filteredCommands[0]?.action(uiState);
        onCommandExecution();
        return;
    };

    useHotkeys("enter", () => onSubmit(), {
        enableOnFormTags: false,
    });

    const [filteredCommands, filteredCommandsRefs] = useMemo(() => {
        if (searchTerm == "")
            return [commands, commands.map(() => createRef<HTMLDivElement>())];

        const formattedSearchTerm = searchTerm.toLocaleLowerCase();

        const res = commands.filter((command) =>
            command.title.toLocaleLowerCase().includes(formattedSearchTerm)
        );

        // Make sure current focus is not out of bounds it list became shorter
        while (currentFocus >= res.length) {
            setCurrentFocus((prev) => prev - 1);
        }

        return [res, res.map(() => createRef<HTMLDivElement>())];
    }, [searchTerm]);

    const updateCurrentFocus = (i: number) => {
        const newCurrentFocus = currentFocus + i;
        if (
            newCurrentFocus < -1 ||
            newCurrentFocus >= filteredCommandsRefs.length
        ) {
            return;
        }

        setCurrentFocus(newCurrentFocus);

        if (newCurrentFocus == -1) {
            searchInput.current?.focus();
        } else {
            filteredCommandsRefs[newCurrentFocus].current?.focus();
        }
    };

    useHotkeys(
        "down",
        () => {
            updateCurrentFocus(1);
        },
        {
            enableOnFormTags: true,
        }
    );

    useHotkeys(
        "up",
        () => {
            updateCurrentFocus(-1);
        },
        {
            enableOnFormTags: true,
        }
    );

    return (
        <div>
            <form onSubmit={onSubmit}>
                <Input
                    // autoFocus
                    ref={searchInput}
                    onFocus={() => setCurrentFocus(-1)}
                    placeholder="Enter command"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus-visible:ring-violet-500 rounded-none"
                />
            </form>

            <div className="overflow-hidden rounded-b-lg">
                <div className="max-h-[28rem] overflow-auto  px-2 border-t border-secondary">
                    {filteredCommands.map((command, index) => (
                        <div
                            className={cn(` rounded-lg ring-primary mt-4`, {
                                "ring-1": index == 0 && currentFocus == -1,
                            })}
                        >
                            <Command
                                ref={filteredCommandsRefs[index]}
                                key={command.title}
                                title={command.title}
                                shortcut={command.shortcut}
                                onClick={() => onSubmit()}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function CommandBox() {
    const [opened, setOpened] = useState(false);
    const uiState = useUiState.use.uiState();

    useHotkeys(
        "ctrl+shift+p",
        () => {
            if (uiState.section == "vault-manager") return;
            setOpened((prev) => !prev);
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        }
    );
    useHotkeys("esc", () => setOpened(false), {
        enableOnFormTags: true,
    });

    return (
        <Dialog open={opened}>
            <DialogContent className="p-0  ">
                <DialogHeader className="p-0">
                    <DialogTitle className="mx-auto sr-only">
                        Command palette
                    </DialogTitle>
                </DialogHeader>
                <CommandList onCommandExecution={() => setOpened(false)} />
            </DialogContent>
        </Dialog>
    );
}
