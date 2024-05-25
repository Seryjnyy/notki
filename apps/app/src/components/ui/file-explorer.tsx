import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";

import { useEffect, useState } from "react";
import { getAllFilesInFolderWithMetadata } from "~/lib/file-services/directory-service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  CardStackPlusIcon,
  CaretDownIcon,
  CaretRightIcon,
  CaretSortIcon,
  FilePlusIcon,
  PlusIcon,
  ReloadIcon,
  ResetIcon,
} from "@radix-ui/react-icons";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { produce } from "immer";
import {
  changeStoredCurrentTab,
  changeStoredOpenedTabs,
} from "~/lib/file-services/tab-service";
import { Button } from "@repo/ui/button";
import { ScrollArea } from "@repo/ui/scroll-area";
import { FileEntryWithMetadata } from "~/lib/file-services/file-service";
import { useUiState } from "~/lib/ui-store";
import { useWorkspaceConfig } from "~/lib/workspace-store";

const File = ({ data }: { data: FileEntryWithMetadata }) => {
  const currentTab = useOpenedTabs((state) => state.currentTab);
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);
  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);
  const uiState = useUiState((state) => state.uiState);

  const bgColour = currentTab == data.name ? "bg-secondary" : "";

  const onClick = () => {
    console.log(data.metadata);
    if (uiState.section != "note-manager") return;

    setCurrentTab(data.id);
    changeStoredCurrentTab(data.id);

    // Only add once
    if (openedTabs.find((tab) => tab.title == data.name) == undefined) {
      setOpenedTabs(
        produce(openedTabs, (draft) => {
          draft.push({
            id: data.id,
            filepath: data.path,
            title: data.name ?? "unknown",
          });
        })
      );
      console.log("opened tabs", openedTabs);
      changeStoredOpenedTabs(openedTabs);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`px-2 hover:bg-secondary ${bgColour} rounded-md text-start`}
            onClick={onClick}
          >
            <span className="text-ellipsis text-nowrap"> {data.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col">
          <p>
            modified at{" "}
            <span className="font-semibold">
              {data.metadata.modifiedAt.toDateString()}
            </span>
          </p>
          <p>
            created at{" "}
            <span className="font-semibold">
              {data.metadata.createdAt.toDateString()}
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Folder = ({ data }: { data: FileEntryWithMetadata }) => {
  // TODO : ui state should store which one is open
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger
        className="px-2 w-full hover:bg-gray-300 rounded-md text-start flex items-center "
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {open && <CaretDownIcon />}
        {!open && <CaretRightIcon />}
        <span>{data.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 ml-4 ">
        {data.children &&
          data.children.map((file, index) => {
            if (file.children) {
              return <Folder data={file} key={index} />;
            }

            return <File data={file} key={index} />;
          })}
      </CollapsibleContent>
    </Collapsible>
  );
};

// const FileExplorerActions = () => {
//   return (

//   );
// };

export default function FileExplorer() {
  const [files, setFiles] = useState<FileEntryWithMetadata[]>([]);
  const [open, setOpen] = useState(true);
  const workspacePath = useWorkspaceConfig((state) => state.currentWorkspace);

  useEffect(() => {
    const setUp = async () => {
      if (workspacePath == "") return;

      const res = await getAllFilesInFolderWithMetadata(workspacePath);
      console.log(res);
      setFiles(res);
    };
    setUp();
  }, []);

  const onReload = async () => {
    if (workspacePath == "") return;
    const res = await getAllFilesInFolderWithMetadata(workspacePath);

    setFiles(res);
  };

  return (
    <div className=" h-full flex flex-col">
      <div className="pt-2 w-full flex justify-start pb-2 pl-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="w-fit h-fit" variant={"ghost"} asChild>
                <FilePlusIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="w-fit h-fit" variant={"ghost"} asChild>
                <CardStackPlusIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create folder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                className="w-fit h-fit"
                variant={"ghost"}
                onClick={onReload}
                asChild
              >
                <ReloadIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reload folder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="w-fit h-fit" variant={"ghost"} asChild>
                <FilePlusIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button className="w-fit h-fit" variant={"ghost"}>
          <CaretSortIcon />
        </Button>
      </div>

      <div>
        <ScrollArea className="h-[90vh]">
          <Collapsible open={open} className="pr-2">
            <CollapsibleTrigger
              className="px-2 w-full hover:bg-gray-300 rounded-md text-start flex items-center "
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            >
              {open && <CaretDownIcon />}
              {!open && <CaretRightIcon />}
              <span>{workspacePath}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col px-0 gap-2 pb-12 pt-4 pl-2">
                {files
                  .sort((file) => (file.children ? -1 : 1))
                  .map((file, index) => {
                    if (file.children) {
                      return <Folder data={file} key={index} />;
                    }

                    return <File data={file} key={index} />;
                  })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </ScrollArea>
      </div>
    </div>
  );
}
