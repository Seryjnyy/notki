import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";
import { produce } from "immer";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../sheet";

import { GearIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Button, buttonVariants } from "../../button";
import { Checkbox } from "../../checkbox";
import { Input } from "../../input";
import { Label } from "../../label";
import { RadioGroup, RadioGroupItem } from "../../radio-group";
import { ScrollArea, ScrollBar } from "../../scroll-area";
import { usePreferenceStore } from "@repo/lib/stores/preference-store";
import { NoteView } from "@repo/lib/types/types";
import {
    getDefaultColumns,
    getDefaultFontSize,
    getDefaultLetterSpacing,
    getDefaultLineHeight,
    getDefaultPaddingBottom,
    getDefaultPaddingTop,
    getDefaultPaddingX,
    getDefaultPreferences,
} from "@repo/lib/services/preferences-service";
import ModeToggle from "../../../mode-toggle";
import { cn } from "@repo/ui/lib/utils";

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
            <div className="flex items-center gap-2 justify-between">
                <Label htmlFor={title}>{title}</Label>
                <Button
                    id={title}
                    size={"icon"}
                    variant={"ghost"}
                    onClick={reloadAction}
                >
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
    heading?: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const CheckboxSetting = ({
    title,
    value,
    onCheckedChange,
    heading = false,
}: CheckboxSettingProps) => {
    return (
        <div
            className={cn(
                "flex items-center gap-2 p-1 border-l border-secondary w-full",
                { "justify-between border-none": heading }
            )}
        >
            <Label
                htmlFor={title}
                className={cn("font-normal", {
                    "text-lg font-semibold": heading,
                })}
            >
                {title}
            </Label>
            <Checkbox
                id={title}
                checked={value}
                className={cn({ "rounded-full": !heading })}
                onCheckedChange={(checked: "indeterminate" | boolean) => {
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
                        <SheetTrigger
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            <GearIcon />
                        </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Settings</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-xl text-muted-foreground">
                        Settings
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="pt-4 h-[calc(100vh-4rem)]  pr-3">
                    <div className="p-2 mb-8 border-b border-secondary">
                        <CheckboxSetting
                            heading
                            title="Header"
                            value={settings.header.visible}
                            onCheckedChange={(checked) => {
                                setSettings(
                                    produce(settings, (draft) => {
                                        draft.header.visible = checked;
                                    })
                                );
                            }}
                        />

                        <div className="pl-4 ">
                            <CheckboxSetting
                                title="Titles"
                                value={settings.header.options.title}
                                onCheckedChange={(checked) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.header.options.title =
                                                checked;
                                        })
                                    );
                                }}
                            />

                            <CheckboxSetting
                                title="Actions"
                                value={settings.header.options.actions.visible}
                                onCheckedChange={(checked) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.header.options.actions.visible =
                                                checked;
                                        })
                                    );
                                }}
                            />

                            <div className="pl-4">
                                <CheckboxSetting
                                    title="Remove action"
                                    value={
                                        settings.header.options.actions.options
                                            .remove
                                    }
                                    onCheckedChange={(checked) => {
                                        setSettings(
                                            produce(settings, (draft) => {
                                                draft.header.options.actions.options.remove =
                                                    checked;
                                            })
                                        );
                                    }}
                                />

                                <CheckboxSetting
                                    title="Copy action"
                                    value={
                                        settings.header.options.actions.options
                                            .copy
                                    }
                                    onCheckedChange={(checked) => {
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
                    <div className="mb-8 p-2 border-b border-secondary">
                        <CheckboxSetting
                            heading
                            title="Metadata"
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
                                title="Size"
                                value={settings.metadata.options.size}
                                onCheckedChange={(checked) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.metadata.options.size =
                                                checked;
                                        })
                                    );
                                }}
                            />

                            <CheckboxSetting
                                title="Last modified"
                                value={settings.metadata.options.lastModified}
                                onCheckedChange={(checked) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.metadata.options.lastModified =
                                                checked;
                                        })
                                    );
                                }}
                            />

                            <CheckboxSetting
                                title="Character count"
                                value={settings.metadata.options.characterCount}
                                onCheckedChange={(checked) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.metadata.options.characterCount =
                                                checked;
                                        })
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className="mb-8 p-2 border-b border-secondary">
                        <div>
                            <span className="font-semibold text-lg  leading-none">
                                Notes view
                            </span>
                            <RadioGroup
                                className="ml-4 border-l pl-1 border-secondary"
                                value={settings.view}
                                onValueChange={(val: NoteView) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.view = val;
                                        })
                                    );
                                }}
                            >
                                <div className="flex items-center space-x-2 mt-2">
                                    <RadioGroupItem
                                        value="all"
                                        id="option-all"
                                    />
                                    <Label htmlFor="option-all">All</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="single"
                                        id="option-single"
                                    />
                                    <Label htmlFor="option-single">
                                        One at a time
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className="mb-8 p-2 border-b border-secondary">
                        <span className="text-lg font-semibold  leading-none">
                            Other
                        </span>
                        <div className="ml-4 ">
                            <CheckboxSetting
                                title="Note content selectable"
                                value={settings.styling.note.textSelectable}
                                onCheckedChange={(checked) => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.styling.note.textSelectable =
                                                checked;
                                        })
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className=" mb-8 p-2 border-b border-secondary">
                        <span className="text-lg font-semibold  leading-none">
                            Text
                        </span>
                        <div className=" p-2 ml-4 border-l border-secondary">
                            <NumericalSetting
                                title="Line height"
                                reloadAction={() => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.content.lineHeight =
                                                getDefaultLineHeight();
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
                                                draft.content.lineHeight =
                                                    Number(e.target.value);
                                            })
                                        );
                                    }}
                                />
                            </NumericalSetting>
                            <NumericalSetting
                                title="Letter spacing"
                                reloadAction={() => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.content.letterSpacing =
                                                getDefaultLetterSpacing();
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
                                                draft.content.letterSpacing =
                                                    Number(e.target.value);
                                            })
                                        );
                                    }}
                                />
                            </NumericalSetting>

                            <NumericalSetting
                                title="Font size"
                                reloadAction={() => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.styling.content.fontSize =
                                                getDefaultFontSize();
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
                                                draft.styling.content.fontSize =
                                                    Number(e.target.value);
                                            })
                                        );
                                    }}
                                />
                            </NumericalSetting>
                        </div>
                    </div>

                    <div className="mb-8 p-2 border-b border-secondary">
                        <span className="text-lg font-semibold  leading-none">
                            Card
                        </span>
                        <div className=" p-2 ml-4 border-l border-secondary">
                            <NumericalSetting
                                title="Padding x"
                                reloadAction={() => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.styling.note.paddingX =
                                                getDefaultPaddingX();
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
                                                draft.styling.note.paddingX =
                                                    Number(e.target.value);
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
                                            draft.styling.note.paddingTop =
                                                getDefaultPaddingTop();
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
                                                draft.styling.note.paddingTop =
                                                    Number(e.target.value);
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
                                                draft.styling.note.paddingBottom =
                                                    Number(e.target.value);
                                            })
                                        );
                                    }}
                                />
                            </NumericalSetting>
                        </div>

                        <div className=" p-2 ml-4 border-l border-secondary">
                            <NumericalSetting
                                title="List padding x"
                                reloadAction={() => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.styling.list.paddingX =
                                                getDefaultPaddingX();
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
                                                draft.styling.list.paddingX =
                                                    Number(e.target.value);
                                            })
                                        );
                                    }}
                                />
                            </NumericalSetting>
                        </div>
                    </div>

                    <div className="mb-8 p-2 border-b border-secondary">
                        <span className="text-lg font-semibold">Layout</span>
                        <div className=" p-2 ml-4 border-l border-secondary">
                            <NumericalSetting
                                title="Columns"
                                reloadAction={() => {
                                    setSettings(
                                        produce(settings, (draft) => {
                                            draft.styling.list.columns =
                                                getDefaultColumns();
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
                                                draft.styling.list.columns =
                                                    Number(e.target.value);
                                            })
                                        );
                                    }}
                                />
                            </NumericalSetting>
                        </div>
                    </div>

                    <div className="w-full">
                        <Button
                            className="w-full flex items-center gap-2"
                            variant={"secondary"}
                            onClick={onResetPreferences}
                        >
                            <span>Reset settings</span> <UpdateIcon />
                        </Button>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
