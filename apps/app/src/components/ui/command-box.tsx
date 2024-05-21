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
import { newFile } from "~/lib/file-services/file-service";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { UiState } from "~/lib/types";
import { useUiState } from "~/lib/ui-store";

interface CommandProps {
  title: string;
  shortcut: React.ReactNode;
}

// TODO : focus isn't currently correct, it should work more like vs code does
const Command = forwardRef<HTMLDivElement, CommandProps>(
  ({ title, shortcut }, ref) => {
    return (
      <div
        className="py-2 text-muted-foreground flex items-center justify-between focus:ring-1 focus:ring-white rounded-md"
        ref={ref}
        tabIndex={0}
      >
        <span>{title}</span>
        {shortcut}
      </div>
    );
  }
);

const CommandList = ({
  onCommandExecution,
}: {
  onCommandExecution: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const uiState = useUiState((state) => state.uiState);
  const setUiState = useUiState((state) => state.setUiState);
  const searchInput = useRef<HTMLInputElement>(null);
  const currentFocus = useRef(-1);

  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);

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
            <Badge className="px-1">Ctrl + S</Badge>
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
          const [filename, filepath] = await newFile(
            "C:\\Users\\jakub\\Documents\\test"
          );
          // update tab
          // TODO : using filename which is bad
          setOpenedTabs(
            produce(openedTabs, (draft) => {
              draft.push({ id: "no id", title: filename, filepath: filepath });
            })
          );
          setCurrentTab(filename);
        },
        shortcut: (
          <>
            <Badge className="px-1">Ctrl + N</Badge>
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
            <Badge className="px-1">Ctrl + K</Badge>
          </>
        ),
      },
      {
        title: "Close command palette",
        desc: "Closes command palette.",
        action: () => {},
        shortcut: (
          <>
            <Badge className="px-1">Esc</Badge>
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
            <Badge className="px-1">Ctrl + idk</Badge>
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
            <Badge className="px-1">Ctrl + idk</Badge>
          </>
        ),
      },
    ];

    return [
      ...fileCommands,
      ...noteCommands,
      ...uiCommands,
      ...commandDialogCommands,
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

    if (filteredCommands.length == 1) {
      filteredCommands[0]?.action(uiState);
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

  useEffect(() => {
    console.log("rerendering uistate ", uiState);
  }, [uiState.titlebar]);

  const [filteredTabs, filteredTabsRefs] = useMemo(() => {
    if (searchTerm == "")
      return [openedTabs, openedTabs.map(() => createRef<HTMLDivElement>())];

    // TODO : doing this in all search function :/
    const formattedSearchTerm = searchTerm.toLocaleLowerCase();

    const filtered = openedTabs.filter((tab) =>
      tab.title.toLowerCase().includes(formattedSearchTerm)
    );
    return [filtered, filtered.map(() => createRef<HTMLDivElement>())];
  }, [searchTerm, openedTabs]);

  const [filteredCommands, filteredCommandsRefs] = useMemo(() => {
    if (searchTerm == "")
      return [commands, commands.map(() => createRef<HTMLDivElement>())];

    const formattedSearchTerm = searchTerm.toLocaleLowerCase();

    const res = commands.filter((command) =>
      command.title.toLocaleLowerCase().includes(formattedSearchTerm)
    );

    // Make sure current focus is not out of bounds it list became shorter
    while (currentFocus.current >= res.length) {
      currentFocus.current -= 1;
    }

    return [res, res.map(() => createRef<HTMLDivElement>())];
  }, [searchTerm]);

  const updateCurrentFocus = (i: number) => {
    if (
      currentFocus.current + i < -1 ||
      currentFocus.current + i >= filteredCommandsRefs.length
    ) {
      return;
    }

    currentFocus.current += i;
    console.log(currentFocus.current);

    if (currentFocus.current == -1) {
      searchInput.current?.focus();
    } else {
      filteredCommandsRefs[currentFocus.current].current?.focus();
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
          onFocus={() => (currentFocus.current = -1)}
          placeholder="Enter command"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div
        className={`p-2 ${filteredCommands.length == 1 ? "ring-1" : ""} rounded-md ring-primary mt-4`}
      >
        {filteredCommands.map((command, index) => (
          <Command
            ref={filteredCommandsRefs[index]}
            key={command.title}
            title={command.title}
            shortcut={command.shortcut}
          />
        ))}
      </div>
    </div>
  );
};

export default function CommandBox() {
  const [opened, setOpened] = useState(false);
  useState;

  useHotkeys("ctrl+shift+p", () => setOpened((prev) => !prev), {
    enableOnFormTags: true,
    preventDefault: true,
  });
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
          <CommandList onCommandExecution={() => setOpened(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
