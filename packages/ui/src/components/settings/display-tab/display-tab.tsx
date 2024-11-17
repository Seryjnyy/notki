import { Label } from "@repo/ui/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { RadioCard, RadioCardTitle } from "@repo/ui/components/ui/radio-card";
import {
    limits,
    useNoteDisplaySettings,
} from "@repo/lib/stores/note-display-settings-store";
import { Setting } from "../setting";
import SliderSetting from "../slider-setting";
import { TabContent, TabTitle } from "../setting-tab";

const PaddingTab = () => {
    const colGaps = useNoteDisplaySettings.use.colsGap();
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();
    const setColGaps = useNoteDisplaySettings.use.setColsGap();
    const setPaddingX = useNoteDisplaySettings.use.setPaddingX();
    const setPaddingY = useNoteDisplaySettings.use.setPaddingY();
    const reset = useNoteDisplaySettings.use.reset();

    return (
        <>
            <TabTitle
                onReset={() => {
                    reset(["colsGap", "paddingX", "paddingY"]);
                }}
            >
                Padding
            </TabTitle>

            <TabContent>
                <SliderSetting
                    label="Gap"
                    value={colGaps}
                    limits={limits.colsGap}
                    onChange={setColGaps}
                    onReset={() => reset(["colsGap"])}
                />
                <SliderSetting
                    label="Padding x"
                    value={paddingX}
                    limits={limits.paddingX}
                    onChange={setPaddingX}
                    onReset={() => reset(["paddingX"])}
                />
                <SliderSetting
                    label="Padding y"
                    value={paddingY}
                    limits={limits.paddingY}
                    onChange={setPaddingY}
                    onReset={() => reset(["paddingY"])}
                />
            </TabContent>
        </>
    );
};

const LayoutTab = () => {
    const setCols = useNoteDisplaySettings.use.setCols();
    const setDisplay = useNoteDisplaySettings.use.setDisplay();
    const cols = useNoteDisplaySettings.use.cols();
    const display = useNoteDisplaySettings.use.display();
    const reset = useNoteDisplaySettings.use.reset();

    return (
        <>
            <TabTitle onReset={() => reset(["cols", "display"])}>
                Layout
            </TabTitle>
            <TabContent>
                <div className="w-full border py-3 px-4 rounded-[var(--radius)]">
                    <div className="flex gap-2 items-center">
                        <Label className="max-w-[10rem]  py-1 truncate capitalize">
                            Display
                        </Label>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <RadioCard
                            isActive={display === "grid"}
                            onClick={() => setDisplay("grid")}
                        >
                            <RadioCardTitle>Grid</RadioCardTitle>
                        </RadioCard>
                        <RadioCard
                            isActive={display === "slideshow"}
                            onClick={() => setDisplay("slideshow")}
                        >
                            <RadioCardTitle>Slideshow</RadioCardTitle>
                        </RadioCard>
                    </div>
                </div>
                <SliderSetting
                    label="Grid cols"
                    step={1}
                    value={cols}
                    limits={limits.cols}
                    onChange={setCols}
                    onReset={() => reset(["cols"])}
                    disabled={display === "slideshow"}
                />
            </TabContent>
        </>
    );
};

const PreviewNote = () => {
    return (
        <div className="h-8 w-full border overflow-hidden flex justify-center items-center rounded-[var(--radius)]">
            <span className="text-xs text-muted-foreground">note</span>
        </div>
    );
};

export const DisplayTab = () => {
    const reset = useNoteDisplaySettings.use.reset();
    const cols = useNoteDisplaySettings.use.cols();
    const display = useNoteDisplaySettings.use.display();
    const colsGap = useNoteDisplaySettings.use.colsGap();
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();

    return (
        <div>
            <Setting
                title="Appearance"
                description="Changes how the cards are displayed."
                resetAction={() => reset()}
            >
                <div className="py-8">
                    <Label className="pl-1">Preview</Label>
                    <div className="mb-2 resize-none  border-2 max-w-[40rem]">
                        {display === "grid" && (
                            <div
                                className=" grid"
                                style={{
                                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                    gap: `${colsGap}px`,
                                    padding: `${paddingY}px ${paddingX}px`,
                                }}
                            >
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <PreviewNote key={i} />
                                ))}
                            </div>
                        )}
                        {display === "slideshow" && (
                            <div
                                style={{
                                    padding: `${paddingY}px ${paddingX}px`,
                                }}
                            >
                                <PreviewNote />
                            </div>
                        )}
                    </div>
                </div>
                <Tabs
                    defaultValue="layout"
                    className="border p-3 rounded-[var(--radius)]"
                >
                    <TabsList className="mb-4">
                        <TabsTrigger value="layout">Layout</TabsTrigger>

                        <TabsTrigger value="padding">Padding</TabsTrigger>
                    </TabsList>
                    <TabsContent value="layout">
                        <LayoutTab />
                    </TabsContent>
                    <TabsContent value="padding">
                        <PaddingTab />
                    </TabsContent>
                </Tabs>
            </Setting>
        </div>
    );
};
