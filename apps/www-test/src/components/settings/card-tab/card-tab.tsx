import { Checkbox } from "@repo/ui/checkbox";
import { Label } from "@repo/ui/label";
import { Slider } from "@repo/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { ReactNode } from "react";
import NoteCard from "~/components/compound-ui/note-card";
import { ResetButton } from "~/components/compound-ui/reset-button";
import useNoteContentSettings from "~/hooks/note-settings/use-note-content-settings";
import useNoteFooterSettings from "~/hooks/note-settings/use-note-footer-settings";
import useNoteHeaderSettings from "~/hooks/note-settings/use-note-header-settings";
import useNotePaddingSettings from "~/hooks/note-settings/use-note-padding-settings";
import { Setting } from "../setting";
import { useNoteSettings } from "~/stores/note-settings-store";

// TODO : is it bad that onChange is ignoring the value and just calling toggle?
const HeaderTab = () => {
    const {
        header,
        toggleCopy,
        toggleHeader,
        toggleRemove,
        toggleTitle,
        resetHeader,
    } = useNoteHeaderSettings();

    return (
        <>
            <TabTitle onReset={resetHeader}>Header</TabTitle>
            <TabContent>
                <CheckSetting
                    label="Header visible"
                    value={header.header}
                    onChange={toggleHeader}
                />
                <CheckSetting
                    label="Title visible"
                    value={header.title}
                    onChange={toggleTitle}
                />
                <CheckSetting
                    label="Copy visible"
                    value={header.copy}
                    onChange={toggleCopy}
                />
                <CheckSetting
                    label="Remove visible"
                    value={header.remove}
                    onChange={toggleRemove}
                />
            </TabContent>
        </>
    );
};

const FooterTab = () => {
    const {
        footer,
        toggleCharacterCount,
        toggleFooter,
        toggleLastModified,
        toggleSize,
        resetFooter,
    } = useNoteFooterSettings();

    return (
        <>
            <TabTitle onReset={resetFooter}>Footer</TabTitle>
            <TabContent>
                <CheckSetting
                    label="Metadata visible"
                    onChange={toggleFooter}
                    value={footer.metadata}
                />
                <CheckSetting
                    label="Size visible"
                    onChange={toggleSize}
                    value={footer.size}
                />
                <CheckSetting
                    label="Last modified visible"
                    onChange={toggleLastModified}
                    value={footer.lastModified}
                />
                <CheckSetting
                    label="Character count visible"
                    onChange={toggleCharacterCount}
                    value={footer.characterCount}
                />
            </TabContent>
        </>
    );
};

const ContentTab = () => {
    const {
        content,
        limits,
        toggleTextSelectable,
        updateFontSize,
        updateLetterSpacing,
        resetContent,
        resetFontSize,
        resetLetterSpacing,
    } = useNoteContentSettings();

    return (
        <>
            <TabTitle onReset={resetContent}>Content</TabTitle>

            <TabContent>
                <SliderSetting
                    label="Font size"
                    value={content.fontSize}
                    limits={limits.fontSize}
                    onChange={updateFontSize}
                    onReset={resetFontSize}
                />
                <SliderSetting
                    label="Letter spacing"
                    step={0.1}
                    value={content.letterSpacing}
                    limits={limits.letterSpacing}
                    onChange={updateLetterSpacing}
                    onReset={resetLetterSpacing}
                />
                <CheckSetting
                    label="Text selectable"
                    onChange={toggleTextSelectable}
                    value={content.textSelectable}
                />
            </TabContent>
        </>
    );
};

const TabTitle = ({
    children,
    onReset,
}: {
    children: ReactNode;
    onReset: () => void;
}) => {
    return (
        <div className="flex items-center mb-4">
            <h3 className="font-semibold text-lg">{children}</h3>
            <ResetButton onClick={onReset} />
        </div>
    );
};

const TabContent = ({ children }: { children: ReactNode }) => (
    <div className=" flex flex-wrap gap-2 w-full ">{children}</div>
);

const PaddingTab = () => {
    const {
        padding,
        limits,
        resetPadding,
        resetPaddingBottom,
        resetPaddingTop,
        resetPaddingX,
        updatePaddingBottom,
        updatePaddingTop,
        updatePaddingX,
    } = useNotePaddingSettings();
    return (
        <>
            <TabTitle onReset={resetPadding}>Padding</TabTitle>

            <TabContent>
                <SliderSetting
                    label="Padding X"
                    value={padding.paddingX}
                    limits={limits.paddingX}
                    onChange={updatePaddingX}
                    onReset={resetPaddingX}
                />
                <SliderSetting
                    label="Padding top"
                    value={padding.paddingTop}
                    limits={limits.paddingTop}
                    onChange={updatePaddingTop}
                    onReset={resetPaddingTop}
                />
                <SliderSetting
                    label="Padding bottom"
                    value={padding.paddingBottom}
                    limits={limits.paddingBottom}
                    onChange={updatePaddingBottom}
                    onReset={resetPaddingBottom}
                />
            </TabContent>
        </>
    );
};

export const CardTab = () => {
    const reset = useNoteSettings.use.reset();

    return (
        <div>
            <Setting
                title="Appearance"
                description="Changes how the cards look."
                resetAction={reset}
            >
                <div className="py-8">
                    <Label className="pl-1">Preview</Label>
                    <div className="mb-2 resize-none  max-w-[40rem]">
                        <NoteCard
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
                <Tabs
                    defaultValue="header"
                    className="border p-3 rounded-[var(--radius)]"
                >
                    <TabsList>
                        <TabsTrigger value="header">Header</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="footer">Footer</TabsTrigger>
                        <TabsTrigger value="padding">Padding</TabsTrigger>
                    </TabsList>
                    <TabsContent value="header">
                        <HeaderTab />
                    </TabsContent>
                    <TabsContent value="content">
                        <ContentTab />
                    </TabsContent>
                    <TabsContent value="footer">
                        <FooterTab />
                    </TabsContent>
                    <TabsContent value="padding">
                        <PaddingTab />
                    </TabsContent>
                </Tabs>
            </Setting>
        </div>
    );
};

const SliderSetting = ({
    label,
    value,
    limits,
    step = 1,
    onChange,
    onReset,
}: {
    label: string;
    value: number;
    step?: number;
    limits?: { min: number; max: number };
    onChange: (val: number) => void;
    onReset?: () => void;
}) => {
    return (
        <div className="w-full border py-3 px-4 rounded-[var(--radius)]">
            <div className="flex justify-between items-center w-full">
                <Label className="select-none">{label}</Label>
                {onReset && <ResetButton onClick={onReset} />}
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2">
                    <p className="min-w-[1.5rem] font-bold">{value}</p>
                </div>
                <Slider
                    max={limits?.max}
                    min={limits?.min}
                    step={step}
                    value={[value]}
                    onValueChange={(val) => onChange(val[0])}
                />
            </div>
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
