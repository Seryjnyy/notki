import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GearIcon, UpdateIcon } from "@radix-ui/react-icons";
import FilterAndSort from "./FilterAndSort";
import { Button, buttonVariants } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import NoteCard from "./components/ui/note-card";
import { useNoteStore } from "./lib/note-store";
import { usePreferenceStore } from "./lib/preference-store";
import { getDefaultPreferences } from "./services/preferences";
import { LetterSpacing, LineHeight } from "./lib/types";
import Search from "./Search";
import { useSearch } from "./lib/search-store";

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);
  const searchTerm = useSearch((state) => state.searchTerm);
  const setSearchResultCount = useSearch((state) => state.setResultCount);

  const settings = usePreferenceStore((state) => state.settings);
  const setSettings = usePreferenceStore((state) => state.setSettings);

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id != id));
  };

  const onResetPreferences = () => {
    setSettings(getDefaultPreferences());
  };

  const filterSearch = () => {
    const filtered = notes.filter((note) => note.content.includes(searchTerm));

    setSearchResultCount(filtered.length);
    return filtered;
  };

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
            <div className="pt-12">
              <div className="border p-2">
                <div className="flex items-center gap-2">
                  See titles
                  <Checkbox
                    checked={settings.titles}
                    onCheckedChange={(checked) => {
                      if (checked == "indeterminate") return;

                      setSettings({ ...settings, titles: checked });
                    }}
                  />
                </div>
              </div>
              <div className="border p-2">
                <div className="flex items-center gap-2">
                  See metadata
                  <Checkbox
                    checked={settings.metadata.visible}
                    onCheckedChange={(checked) => {
                      if (checked == "indeterminate") return;

                      setSettings({
                        ...settings,
                        metadata: {
                          visible: checked,
                          options: {
                            ...settings.metadata.options,
                          },
                        },
                      });
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

                        setSettings({
                          ...settings,
                          metadata: {
                            visible: settings.metadata.visible,
                            options: {
                              ...settings.metadata.options,
                              size: checked,
                            },
                          },
                        });
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See last modified
                    <Checkbox
                      checked={settings.metadata.options.lastModified}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings({
                          ...settings,
                          metadata: {
                            visible: settings.metadata.visible,
                            options: {
                              ...settings.metadata.options,
                              lastModified: checked,
                            },
                          },
                        });
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See character count
                    <Checkbox
                      checked={settings.metadata.options.characterCount}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings({
                          ...settings,
                          metadata: {
                            visible: settings.metadata.visible,
                            options: {
                              ...settings.metadata.options,
                              characterCount: checked,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border p-2">
                <div>Line height</div>
                <RadioGroup
                  value={settings.content.lineHeight}
                  onValueChange={(val: LineHeight) =>
                    setSettings({
                      ...settings,
                      content: { ...settings.content, lineHeight: val },
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tight" id="option-tight" />
                    <Label htmlFor="option-tight">Tight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="snug" id="option-snug" />
                    <Label htmlFor="option-snug">Snug</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="option-normal" />
                    <Label htmlFor="option-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relaxed" id="option-relaxed" />
                    <Label htmlFor="option-relaxed">Relaxed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loose" id="option-loose" />
                    <Label htmlFor="option-loose">Loose</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border p-2">
                <div>Letter spacing</div>
                <RadioGroup
                  value={settings.content.letterSpacing}
                  onValueChange={(val: LetterSpacing) =>
                    setSettings({
                      ...settings,
                      content: { ...settings.content, letterSpacing: val },
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tighter" id="option-tighter" />
                    <Label htmlFor="option-tighter">Tighter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tight" id="option-tight" />
                    <Label htmlFor="option-tight">Tight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="option-normal" />
                    <Label htmlFor="option-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wide" id="option-wide" />
                    <Label htmlFor="option-wide">Wide</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="widest" id="option-widest" />
                    <Label htmlFor="option-widest">Widest</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border p-2">
                <div className="flex items-center gap-2">
                  See actions
                  <Checkbox
                    checked={settings.actions.visible}
                    onCheckedChange={(checked) => {
                      if (checked == "indeterminate") return;

                      setSettings({
                        ...settings,
                        actions: {
                          visible: checked,
                          options: { ...settings.actions.options },
                        },
                      });
                    }}
                  />
                </div>
                <div className="pl-4">
                  <div className="flex items-center gap-2">
                    See remove action
                    <Checkbox
                      checked={settings.actions.options.remove}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings({
                          ...settings,
                          actions: {
                            visible: settings.actions.visible,
                            options: {
                              remove: checked,
                              copy: settings.actions.options.copy,
                            },
                          },
                        });
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See copy action
                    <Checkbox
                      checked={settings.actions.options.copy}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings({
                          ...settings,
                          actions: {
                            visible: settings.actions.visible,
                            options: {
                              remove: settings.actions.options.remove,
                              copy: checked,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border p-2">
                <Button className="space-x-2" onClick={onResetPreferences}>
                  <span>Reset preferences</span> <UpdateIcon />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <FilterAndSort />
        <Search />
      </div>

      <div className="flex gap-4 flex-wrap">
        {searchTerm != "" &&
          filterSearch().map((note) => (
            <NoteCard
              note={note}
              key={note.id}
              seeTitles={settings.titles}
              settings={settings}
              handleDelete={handleDelete}
            />
          ))}
        {searchTerm == "" &&
          notes.map((note) => (
            <NoteCard
              note={note}
              key={note.id}
              seeTitles={settings.titles}
              settings={settings}
              handleDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
}
