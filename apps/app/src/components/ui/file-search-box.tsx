import { Badge } from "@repo/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@repo/ui/dialog-controlled";
import { Input } from "@repo/ui/input";

import { appWindow } from "@tauri-apps/api/window";
import { current, produce } from "immer";
import {
    createRef,
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { UiState } from "~/lib/types";
import { useUiState } from "~/lib/ui-store";

// TODO : Might be duplicate code with Command in command search
interface FileSearchResultProps {
    title: string;
}

// TODO : focus isn't currently correct, it should work more like vs code does
const FileSearchResult = forwardRef<HTMLDivElement, FileSearchResultProps>(
    ({ title }, ref) => {
        return (
            <div
                className="py-2 text-muted-foreground flex items-center justify-between focus:ring-1 focus:ring-white rounded-md"
                ref={ref}
                tabIndex={0}
            >
                <span>{title}</span>
            </div>
        );
    }
);

// TODO : duplicate code with command, should have one solution for both
const FileSearchList = ({
    onCommandExecution,
}: {
    onCommandExecution: () => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const searchInput = useRef<HTMLInputElement>(null);
    const currentFocus = useRef(-1);
    const openedTabs = useOpenedTabs((state) => state.openedTabs);
    const setCurrentTab = useOpenedTabs((state) => state.setCurrentTabId);

    const [filteredTabs, filteredTabsRefs] = useMemo(() => {
        if (searchTerm == "")
            return [
                openedTabs,
                openedTabs.map(() => createRef<HTMLDivElement>()),
            ];

        // TODO : doing this in all search function :/
        const formattedSearchTerm = searchTerm.toLocaleLowerCase();

        const filtered = openedTabs.filter((tab) =>
            tab.title.toLowerCase().includes(formattedSearchTerm)
        );
        return [filtered, filtered.map(() => createRef<HTMLDivElement>())];
    }, [searchTerm, openedTabs]);

    const filtered = [...filteredTabs];
    const filteredRefs = [...filteredTabsRefs];

    const updateCurrentFocus = (i: number) => {
        if (
            currentFocus.current + i < -1 ||
            currentFocus.current + i >= filteredRefs.length
        ) {
            return;
        }

        currentFocus.current += i;
        console.log(currentFocus.current);

        if (currentFocus.current == -1) {
            searchInput.current?.focus();
        } else {
            filteredRefs[currentFocus.current].current?.focus();
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

    // TODO : This is all wrong, it should take the one in "focus", this will always take the first value
    const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        if (filtered.length == 1) {
            //   filtered[0]?.action();
            setCurrentTab(filtered[0].title);
            onCommandExecution();
            return;
        }

        if (currentFocus.current > -1) {
            onCommandExecution();
        }
    };

    useHotkeys("enter", () => onSubmit(), {
        enableOnFormTags: false,
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <Input
                    // autoFocus
                    ref={searchInput}
                    onFocus={() => (currentFocus.current = -1)}
                    placeholder="Enter command"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <div
                className={`p-2 ${filtered.length == 1 ? "ring-1" : ""} rounded-md ring-primary mt-4`}
            >
                {filtered.map((result, index) => (
                    <FileSearchResult
                        ref={filteredRefs[index]}
                        key={result.title}
                        title={result.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default function FileSearchBox() {
    const [opened, setOpened] = useState(false);

    useHotkeys(
        "ctrl+p",
        () => {
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
            <DialogContent>
                <DialogHeader>
                    {/* <div className="flex items-center justify-between">
              <DialogTitle className="w-fit">Command</DialogTitle>
              <DialogClose onClick={() => setOpened(false)}>
                <Cross2Icon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div> */}
                    {/* <DialogDescription>Enter command</DialogDescription> */}
                    <FileSearchList
                        onCommandExecution={() => setOpened(false)}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
