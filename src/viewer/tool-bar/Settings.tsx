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

interface NumericalSettingProps {
  title: string;
  reloadAction: () => void;
  children: ReactNode;
}

const NumericalSetting = ({
  title,
  reloadAction,
  children,
}: NumericalSettingProps) => {
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

interface CheckboxSettingProps {
  title: string;
  value: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const CheckboxSetting = ({
  title,
  value,
  onCheckedChange,
}: CheckboxSettingProps) => {
  return (
    <div className="flex items-center gap-2">
      {title}
      <Checkbox
        checked={value}
        onCheckedChange={(checked) => {
          if (checked == "indeterminate") return;

          onCheckedChange(checked);
        }}
      />
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

        <ScrollArea className="pt-12 h-screen pb-[8rem]">
          <ScrollBar />
          <div className="border p-2">
            <CheckboxSetting
              title="See header"
              value={settings.header.visible}
              onCheckedChange={(checked) => {
                setSettings(
                  produce(settings, (draft) => {
                    draft.header.visible = checked;
                  })
                );
              }}
            />

            <div className="pl-4">
              <CheckboxSetting
                title="See titles"
                value={settings.header.options.title}
                onCheckedChange={(checked) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.header.options.title = checked;
                    })
                  );
                }}
              />

              <CheckboxSetting
                title="See actions"
                value={settings.header.options.actions.visible}
                onCheckedChange={(checked) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.header.options.actions.visible = checked;
                    })
                  );
                }}
              />

              <div className="pl-4">
                <CheckboxSetting
                  title="See remove action"
                  value={settings.header.options.actions.options.remove}
                  onCheckedChange={(checked) => {
                    setSettings(
                      produce(settings, (draft) => {
                        draft.header.options.actions.options.remove = checked;
                      })
                    );
                  }}
                />

                <CheckboxSetting
                  title="See copy action"
                  value={settings.header.options.actions.options.copy}
                  onCheckedChange={(checked) => {
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
            <CheckboxSetting
              title="See metadata"
              value={settings.metadata.visible}
              onCheckedChange={(checked) => {
                setSettings(
                  produce(settings, (draft) => {
                    draft.metadata.visible = checked;
                  })
                );
              }}
            />

            <div className="pl-4">
              <CheckboxSetting
                title="See size"
                value={settings.metadata.options.size}
                onCheckedChange={(checked) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.metadata.options.size = checked;
                    })
                  );
                }}
              />

              <CheckboxSetting
                title="See last modified"
                value={settings.metadata.options.lastModified}
                onCheckedChange={(checked) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.metadata.options.lastModified = checked;
                    })
                  );
                }}
              />

              <CheckboxSetting
                title="See character count"
                value={settings.metadata.options.characterCount}
                onCheckedChange={(checked) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.metadata.options.characterCount = checked;
                    })
                  );
                }}
              />
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
            <NumericalSetting
              title="List padding x"
              reloadAction={() => {
                setSettings(
                  produce(settings, (draft) => {
                    draft.styling.list.paddingX = getDefaultPaddingX();
                  })
                );
              }}
            >
              <Input
                type="number"
                step="0.1"
                value={settings.styling.list.paddingX}
                onChange={(e) => {
                  setSettings(
                    produce(settings, (draft) => {
                      draft.styling.list.paddingX = Number(e.target.value);
                    })
                  );
                }}
              />
            </NumericalSetting>
          </div>

          <div className="border p-2">
            <CheckboxSetting
              title="Note content selectable"
              value={settings.styling.note.textSelectable}
              onCheckedChange={(checked) => {
                setSettings(
                  produce(settings, (draft) => {
                    draft.styling.note.textSelectable = checked;
                  })
                );
              }}
            />
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
