import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { produce } from "immer";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GearIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import FilterAndSort from "./FilterAndSort";
import Search from "./Search";
import { Button, buttonVariants } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import NoteCard from "./components/ui/note-card";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { useNoteStore } from "./lib/note-store";
import { usePreferenceStore } from "./lib/preference-store";
import { useSearch } from "./lib/search-store";
import { Note } from "./lib/types";
import {
  getDefaultColumns,
  getDefaultFontSize,
  getDefaultLetterSpacing,
  getDefaultLineHeight,
  getDefaultPaddingBottom,
  getDefaultPaddingTop,
  getDefaultPaddingX,
  getDefaultPreferences,
} from "./services/preferences";

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);
  const searchTerm = useSearch((state) => state.searchTerm);
  const setSearchResultCount = useSearch((state) => state.setResultCount);
  const searchTarget = useSearch((state) => state.searchTarget);

  const settings = usePreferenceStore((state) => state.settings);
  const setSettings = usePreferenceStore((state) => state.setSettings);

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id != id));
  };

  const onResetPreferences = () => {
    setSettings(getDefaultPreferences());
  };

  const filterSearch = () => {
    let filtered: Note[] = [];

    switch (searchTarget) {
      case "content":
        filtered = notes.filter((note) => note.content.includes(searchTerm));
        break;
      case "title":
        filtered = notes.filter((note) => note.fileName.includes(searchTerm));
        break;
      case "all":
        {
          const filterSet = new Set<Note>();
          const combined = [
            ...notes.filter((note) => note.content.includes(searchTerm)),
            ...notes.filter((note) => note.fileName.includes(searchTerm)),
          ];
          for (const note of combined) {
            filterSet.add(note);
          }
          filtered = Array.from(filterSet);
        }
        break;
    }

    setSearchResultCount(filtered.length);
    return filtered;
  };

  const listColumns = `md:grid-cols-${settings.styling.list.columns}`;

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setNotes([])} variant={"ghost"}>
                <UpdateIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset notes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Sheet>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
                  <GearIcon />
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>

            <ScrollArea className="pt-12 h-screen pb-12">
              <ScrollBar />
              <div className="border p-2">
                <div className="flex items-center gap-2">
                  See header
                  <Checkbox
                    checked={settings.header.visible}
                    onCheckedChange={(checked) => {
                      if (checked == "indeterminate") return;

                      setSettings(
                        produce(settings, (draft) => {
                          draft.header.visible = checked;
                        })
                      );
                    }}
                  />
                </div>
                <div className="pl-4">
                  <div className="flex items-center gap-2">
                    See titles
                    <Checkbox
                      checked={settings.header.options.title}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings(
                          produce(settings, (draft) => {
                            draft.header.options.title = checked;
                          })
                        );
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See actions
                    <Checkbox
                      checked={settings.header.options.actions.visible}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings(
                          produce(settings, (draft) => {
                            draft.header.options.actions.visible = checked;
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="pl-4">
                    <div className="flex items-center gap-2">
                      See remove action
                      <Checkbox
                        checked={settings.header.options.actions.options.remove}
                        onCheckedChange={(checked) => {
                          if (checked == "indeterminate") return;
                          setSettings(
                            produce(settings, (draft) => {
                              draft.header.options.actions.options.remove =
                                checked;
                            })
                          );
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      See copy action
                      <Checkbox
                        checked={settings.header.options.actions.options.copy}
                        onCheckedChange={(checked) => {
                          if (checked == "indeterminate") return;

                          setSettings(
                            produce(settings, (draft) => {
                              draft.header.options.actions.options.copy =
                                checked;
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border p-2">
                <div className="flex items-center gap-2">
                  See metadata
                  <Checkbox
                    checked={settings.metadata.visible}
                    onCheckedChange={(checked) => {
                      if (checked == "indeterminate") return;

                      setSettings(
                        produce(settings, (draft) => {
                          draft.metadata.visible = checked;
                        })
                      );
                    }}
                  />
                </div>

                <div className="pl-4">
                  <div className="flex items-center gap-2">
                    See size
                    <Checkbox
                      checked={settings.metadata.options.size}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings(
                          produce(settings, (draft) => {
                            draft.metadata.options.size = checked;
                          })
                        );
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See last modified
                    <Checkbox
                      checked={settings.metadata.options.lastModified}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings(
                          produce(settings, (draft) => {
                            draft.metadata.options.lastModified = checked;
                          })
                        );
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See character count
                    <Checkbox
                      checked={settings.metadata.options.characterCount}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings(
                          produce(settings, (draft) => {
                            draft.metadata.options.characterCount = checked;
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border p-2">
                <NumericalSetting
                  title="Line height"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.content.lineHeight = getDefaultLineHeight();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.content.lineHeight}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.content.lineHeight = Number(e.target.value);
                        })
                      );
                    }}
                  />
                </NumericalSetting>
              </div>

              <div className="border p-2">
                <NumericalSetting
                  title="Letter spacing"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.content.letterSpacing = getDefaultLetterSpacing();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.content.letterSpacing}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.content.letterSpacing = Number(e.target.value);
                        })
                      );
                    }}
                  />
                </NumericalSetting>
              </div>

              <div className="border p-2">
                <NumericalSetting
                  title="Padding x"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.styling.note.paddingX = getDefaultPaddingX();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.styling.note.paddingX}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.styling.note.paddingX = Number(e.target.value);
                        })
                      );
                    }}
                  />
                </NumericalSetting>

                <NumericalSetting
                  title="Padding top"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.styling.note.paddingTop = getDefaultPaddingTop();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.styling.note.paddingTop}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.styling.note.paddingTop = Number(
                            e.target.value
                          );
                        })
                      );
                    }}
                  />
                </NumericalSetting>

                <NumericalSetting
                  title="Padding bottom"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.styling.note.paddingBottom =
                          getDefaultPaddingBottom();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.styling.note.paddingBottom}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.styling.note.paddingBottom = Number(
                            e.target.value
                          );
                        })
                      );
                    }}
                  />
                </NumericalSetting>
              </div>

              <div className="border p-2">
                <NumericalSetting
                  title="Columns"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.styling.list.columns = getDefaultColumns();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="1"
                    value={settings.styling.list.columns}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.styling.list.columns = Number(e.target.value);
                        })
                      );
                    }}
                  />
                </NumericalSetting>
              </div>

              <div className="border p-2">
                <NumericalSetting
                  title="Font size"
                  reloadAction={() => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.styling.content.fontSize = getDefaultFontSize();
                      })
                    );
                  }}
                >
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.styling.content.fontSize}
                    onChange={(e) => {
                      setSettings(
                        produce(settings, (draft) => {
                          draft.styling.content.fontSize = Number(
                            e.target.value
                          );
                        })
                      );
                    }}
                  />
                </NumericalSetting>
              </div>

              <div className="border p-2">
                <Button className="space-x-2" onClick={onResetPreferences}>
                  <span>Reset preferences</span> <UpdateIcon />
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <FilterAndSort />
        <Search />
      </div>

      <div className={"grid grid-cols-1 gap-4 " + listColumns}>
        {searchTerm != "" &&
          filterSearch().map((note) => (
            <NoteCard
              note={note}
              key={note.id}
              settings={settings}
              handleDelete={handleDelete}
            />
          ))}
        {searchTerm == "" &&
          notes.map((note) => (
            <NoteCard
              note={note}
              key={note.id}
              settings={settings}
              handleDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
}

const NumericalSetting = ({
  title,
  reloadAction,
  children,
}: {
  title: string;
  reloadAction: () => void;
  children: ReactNode;
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 pb-4">
        <h4>{title}</h4>
        <Button className=" px-1" variant={"ghost"} onClick={reloadAction}>
          <ReloadIcon className="w-3 h-3" />
        </Button>
      </div>
      {children}
    </div>
  );
};
