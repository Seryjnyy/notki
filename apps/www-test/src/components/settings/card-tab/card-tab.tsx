import { useStyle } from "~/atoms/atoms";
import { BorderRadiusVisualizer } from "~/components/settings/appearance-tab/border-radius-visualiser";
import {
    BORDER_RADII,
    DEFAULT_BORDER_RADIUS,
    DEFAULT_THEME,
} from "~/config/appearance.config";
import { Setting } from "../setting";
import { Label } from "@repo/ui/label";
import NoteCard from "~/components/compound-ui/note-card";
import { Note } from "@repo/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Check, Undo2 } from "lucide-react";
import { Checkbox } from "@repo/ui/checkbox";
import { ResetButton } from "~/components/compound-ui/reset-button";
import { Button } from "@repo/ui/button";
import { Slider } from "@repo/ui/slider";

export const CardTab = () => {
    return (
        <div>
            <Setting
                title="Appearance"
                description="Changes how the cards look."
                // resetAction={() => setBorderRadius(DEFAULT_BORDER_RADIUS)}
            >
                <div className="py-8">
                    <Label className="pl-1">Preview</Label>
                    <div className="mb-2 resize-none  ">
                        <NoteCard
                            handleDelete={() => {}}
                            note={{
                                characterCount: 425,
                                fileName: "test file",
                                id: "123",
                                lastModified: Date.now(),
                                size: 1234,
                                content: "lorem ipsum some text and stuff.",
                            }}
                        />
                    </div>
                </div>
                <Tabs defaultValue="header">
                    <TabsList>
                        <TabsTrigger value="header">Header</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="footer">Footer</TabsTrigger>
                        <TabsTrigger value="padding">Padding</TabsTrigger>
                    </TabsList>
                    <TabsContent value="header" className="px-4 ">
                        <div className="flex items-center mb-4">
                            <h3 className="font-semibold text-lg">Header</h3>
                            <ResetButton onClick={() => {}} />
                        </div>
                        <div className="pl-4 flex flex-wrap gap-2 w-full ">
                            <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
                                <div className="flex gap-2 items-center">
                                    <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                        Header visible
                                    </Label>
                                </div>
                                <Checkbox />
                            </div>
                            <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
                                <div className="flex gap-2 items-center">
                                    <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                        Title visible
                                    </Label>
                                </div>
                                <Checkbox />
                            </div>
                            <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
                                <div className="flex gap-2 items-center">
                                    <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                        Copy visible
                                    </Label>
                                </div>
                                <Checkbox />
                            </div>
                            <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
                                <div className="flex gap-2 items-center">
                                    <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                        Remove visible
                                    </Label>
                                </div>
                                <Checkbox />
                            </div>

                            {/* <div className="pl-4 ">
                                <div className="flex items-center justify-between w-full border py-3 px-4 rounded-r-[var(--radius)]">
                                    <div className="flex gap-2 items-center">
                                        <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                            Title
                                        </Label>
                                    </div>
                                    <Checkbox />
                                </div>
                                <div className="border py-3 px-4 rounded-r-[var(--radius)]">
                                    <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                        Actions
                                    </Label>

                                    <div className="pl-4 ">
                                        <div className="flex items-center justify-between w-full border py-3 px-4 rounded-r-[var(--radius)]">
                                            <div className="flex gap-2 items-center">
                                                <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                                    Copy
                                                </Label>
                                            </div>
                                            <Checkbox />
                                        </div>
                                        <div className="flex items-center justify-between w-full border py-3 px-4 rounded-r-[var(--radius)]">
                                            <div className="flex gap-2 items-center">
                                                <Label className="max-w-[10rem]  py-1 truncate capitalize">
                                                    Remove
                                                </Label>
                                            </div>
                                            <Checkbox />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </TabsContent>
                    <TabsContent value="content" className="px-4">
                        <div className="flex items-center mb-4">
                            <h3 className="font-semibold text-lg">Content</h3>
                            <ResetButton onClick={() => {}} />
                        </div>
                        <div className="pl-4 flex flex-wrap gap-2 w-full ">
                            <SliderSetting label="Line height" />
                            <SliderSetting label="Letter spacing" />
                            <SliderSetting label="Font size" />
                            <CheckSetting
                                label="Text selectable"
                                onChange={() => {}}
                                value={true}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="footer">
                        <div className="flex items-center mb-4">
                            <h3 className="font-semibold text-lg">Metadata</h3>
                            <ResetButton onClick={() => {}} />
                        </div>
                        <div className="pl-4 flex flex-wrap gap-2 w-full ">
                            <CheckSetting
                                label="Size"
                                onChange={() => {}}
                                value={true}
                            />
                            <CheckSetting
                                label="Last modified"
                                onChange={() => {}}
                                value={true}
                            />
                            <CheckSetting
                                label="Character count"
                                onChange={() => {}}
                                value={true}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="padding">
                        <div className="flex items-center mb-4">
                            <h3 className="font-semibold text-lg">Padding</h3>
                            <ResetButton onClick={() => {}} />
                        </div>
                        <div className="pl-4 flex flex-wrap gap-2 w-full ">
                            <SliderSetting label="Padding X" />
                            <SliderSetting label="Padding top" />
                            <SliderSetting label="Padding bottom" />
                        </div>
                    </TabsContent>
                </Tabs>
            </Setting>
        </div>
    );
};

const SliderSetting = ({ label }: { label: string }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center w-full">
                <Label className="select-none">{label}</Label>
                <ResetButton onClick={() => {}} />
            </div>
            <Slider />
        </div>
    );
};

interface CheckSettingProps {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}

const CheckSetting = ({ label, value, onChange }: CheckSettingProps) => {
    return (
        <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
            <div className="flex gap-2 items-center">
                <Label className="max-w-[10rem]  py-1 truncate capitalize">
                    {label}
                </Label>
            </div>
            <Checkbox
                checked={value}
                onCheckedChange={(val) => {
                    if (val == "indeterminate") {
                        onChange(false);
                        return;
                    }
                    onChange(val);
                }}
            />
        </div>
    );
};
