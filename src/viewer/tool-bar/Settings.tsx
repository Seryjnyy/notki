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
import { RadioGroup } from "@radix-ui/react-radio-group";
import { ReactNode } from "react";
import { Button, buttonVariants } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroupItem } from "../../components/ui/radio-group";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { usePreferenceStore } from "../../lib/preference-store";
import { NoteView } from "../../lib/types";
import {
  getDefaultColumns,
  getDefaultFontSize,
  getDefaultLetterSpacing,
  getDefaultLineHeight,
  getDefaultPaddingBottom,
  getDefaultPaddingTop,
  getDefaultPaddingX,
  getDefaultPreferences,
} from "../../services/preferences";

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

export default function Settings() {
  const settings = usePreferenceStore((state) => state.settings);
  const setSettings = usePreferenceStore((state) => state.setSettings);

  const onResetPreferences = () => {
    setSettings(getDefaultPreferences());
  };

  return (
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
                          draft.header.options.actions.options.remove = checked;
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
                          draft.header.options.actions.options.copy = checked;
                        })
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border p-2">
            <div>
              <div>Notes view</div>
              <RadioGroup
                value={settings.view}
                onValueChange={(val: NoteView) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.view = val;
                    })
                  );
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="option-all" />
                  <Label htmlFor="option-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="option-single" />
                  <Label htmlFor="option-single">One at a time</Label>
                </div>
              </RadioGroup>
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
                      draft.styling.note.paddingTop = Number(e.target.value);
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
                      draft.styling.note.paddingBottom = Number(e.target.value);
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
                      draft.styling.content.fontSize = Number(e.target.value);
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
  );
}
