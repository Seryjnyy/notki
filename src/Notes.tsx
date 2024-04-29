import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  GearIcon,
  MixerVerticalIcon,
  ReloadIcon,
  ResetIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import NoteCard from "./components/ui/note-card";
import { useNoteStore } from "./lib/note-store";
import { NoteSettings } from "./lib/types";
import {
  getDefaultPreferences,
  getPreferences,
  savePreferences,
} from "./services/preferences";
import FilterAndSort from "./FilterAndSort";

// const NoteMetadataSettings = () => {
//   return()
// }

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);
  const [settings, setSettings] = useState<NoteSettings>(getPreferences());

  useEffect(() => {
    savePreferences(settings);
  }, [settings]);

  useEffect(() => {
    console.log("notes change");
  }, [notes]);

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id != id));
  };

  const onResetPreferences = () => {
    setSettings(getDefaultPreferences());
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

                      setSettings((prev) => ({ ...prev, titles: checked }));
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

                      setSettings((prev) => ({
                        ...prev,
                        metadata: {
                          visible: checked,
                          options: {
                            ...prev.metadata.options,
                          },
                        },
                      }));
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

                        setSettings((prev) => ({
                          ...prev,
                          metadata: {
                            visible: prev.metadata.visible,
                            options: {
                              size: checked,
                              lastModified: prev.metadata.options.lastModified,
                              characterCount:
                                prev.metadata.options.characterCount,
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See last modified
                    <Checkbox
                      checked={settings.metadata.options.lastModified}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings((prev) => ({
                          ...prev,
                          metadata: {
                            visible: prev.metadata.visible,
                            options: {
                              size: prev.metadata.options.size,
                              lastModified: checked,
                              characterCount:
                                prev.metadata.options.characterCount,
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See character count
                    <Checkbox
                      checked={settings.metadata.options.characterCount}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings((prev) => ({
                          ...prev,
                          metadata: {
                            visible: prev.metadata.visible,
                            options: {
                              size: prev.metadata.options.size,
                              lastModified: prev.metadata.options.lastModified,
                              characterCount: checked,
                            },
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border p-2">
                <div>Line height</div>
                <RadioGroup
                  defaultValue="option-one"
                  value={settings.lineHeight}
                  onValueChange={(
                    val: "tight" | "snug" | "normal" | "relaxed" | "loose"
                  ) => setSettings((prev) => ({ ...prev, lineHeight: val }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="option-normal" />
                    <Label htmlFor="option-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tight" id="option-tight" />
                    <Label htmlFor="option-tight">Tight</Label>
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

                      setSettings((prev) => ({
                        ...prev,
                        actions: {
                          visible: checked,
                          options: { ...prev.actions.options },
                        },
                      }));
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

                        setSettings((prev) => ({
                          ...prev,
                          actions: {
                            visible: prev.actions.visible,
                            options: {
                              remove: checked,
                              copy: prev.actions.options.copy,
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    See copy action
                    <Checkbox
                      checked={settings.actions.options.copy}
                      onCheckedChange={(checked) => {
                        if (checked == "indeterminate") return;

                        setSettings((prev) => ({
                          ...prev,
                          actions: {
                            visible: prev.actions.visible,
                            options: {
                              remove: prev.actions.options.remove,
                              copy: checked,
                            },
                          },
                        }));
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
      </div>

      <div className="flex gap-4 flex-wrap">
        {notes.map((note) => (
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
