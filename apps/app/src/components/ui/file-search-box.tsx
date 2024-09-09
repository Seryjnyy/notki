import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/dialog-controlled";
import { Input } from "@repo/ui/input";

import {
    createRef,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getAllFilesFoldersWithMetadata } from "~/lib/file-services/directory-service";
import { FileEntryWithMetadata } from "~/lib/file-services/file-service";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { useUiState } from "~/lib/ui-store";
import { cn } from "~/lib/utils";
import { useWorkspaceConfig } from "~/lib/workspace-store";

interface FileProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    path: string;
}

const File = forwardRef<HTMLDivElement, FileProps>(
    ({ title, path, ...props }, ref) => {
        return (
            <div
                className="py-2 text-muted-foreground flex items-center justify-between focus:ring-1 focus:ring-white rounded-md cursor-pointer hover:bg-secondary px-2"
                ref={ref}
                tabIndex={0}
                {...props}
            >
                <span className="font-semibold">{title}</span>
                <span className="text-xs">{path}</span>
            </div>
        );
    }
);

const FileList = ({
    onCommandExecution,
}: {
    onCommandExecution: () => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const searchInput = useRef<HTMLInputElement>(null);
    const [currentFocus, setCurrentFocus] = useState(-1);
    const workspace = useWorkspaceConfig.use.currentWorkspace();
    const [files, setFiles] = useState<FileEntryWithMetadata[]>([]);
    const addOpenTab = useOpenedTabs.use.addOpenTab();
    const setCurrentTabId = useOpenedTabs.use.setCurrentTabId();

    useEffect(() => {
        const setUp = async () => {
            if (!workspace) return;

            const allFiles = await getAllFilesFoldersWithMetadata(
                workspace?.filepath,
                true
            );

            const onlyFiles = allFiles.filter(
                (file) => file.children == undefined
            );

            setFiles(onlyFiles);
        };

        setUp();
    }, []);

    const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (filteredFiles.length <= 0 || currentFocus >= filteredFiles.length) {
            return;
        }

        let chosenFile = null;

        if (currentFocus == -1) {
            chosenFile = filteredFiles[0];
        } else {
            chosenFile = filteredFiles[currentFocus];
        }

        if (!chosenFile) return;

        addOpenTab({
            id: chosenFile.id,
            filepath: chosenFile.path,
            title: chosenFile.name ?? "???",
            workspaceId: workspace!.id,
        });
        setCurrentTabId(chosenFile.id);

        onCommandExecution();
    };

    const onClickFile = (file: FileEntryWithMetadata) => {
        addOpenTab({
            id: file.id,
            filepath: file.path,
            title: file.name ?? "???",
            workspaceId: workspace!.id,
        });
        setCurrentTabId(file.id);

        onCommandExecution();
    };

    useHotkeys("enter", () => onSubmit(), {
        enableOnFormTags: false,
    });

    const [filteredFiles, filteredFilesRefs] = useMemo(() => {
        if (searchTerm == "")
            return [files, files.map(() => createRef<HTMLDivElement>())];

        const formattedSearchTerm = searchTerm.toLocaleLowerCase();

        const filtered = files.filter((file) =>
            file.name?.toLocaleLowerCase().includes(formattedSearchTerm)
        );

        return [filtered, filtered.map(() => createRef<HTMLDivElement>())];
    }, [searchTerm, files]);

    const updateCurrentFocus = (i: number) => {
        let newCurrentFocus = currentFocus + i;
        if (
            newCurrentFocus < -1 ||
            newCurrentFocus >= filteredFilesRefs.length
        ) {
            return;
        }

        if (currentFocus == -1 && newCurrentFocus == 0) newCurrentFocus += 1;
        setCurrentFocus(newCurrentFocus);

        if (newCurrentFocus == -1) {
            searchInput.current?.focus();
        } else {
            filteredFilesRefs[newCurrentFocus].current?.focus();
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
                    placeholder="Enter filename"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus-visible:ring-violet-500 rounded-none"
                />
            </form>

            <div className="overflow-hidden rounded-b-lg">
                <div className="max-h-[28rem] overflow-auto  px-2 border-t border-secondary pb-1">
                    {filteredFiles.map((file, index) => (
                        <div
                            className={cn(` rounded-lg ring-primary mt-4`, {
                                "ring-1": index == 0 && currentFocus == -1,
                            })}
                        >
                            <File
                                ref={filteredFilesRefs[index]}
                                key={file.path ?? ""}
                                title={file.name ?? ""}
                                path={file.path}
                                onClick={() => onClickFile(file)}
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
        "ctrl+p",
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
                        File search
                    </DialogTitle>
                </DialogHeader>
                <FileList onCommandExecution={() => setOpened(false)} />
            </DialogContent>
        </Dialog>
    );
}
