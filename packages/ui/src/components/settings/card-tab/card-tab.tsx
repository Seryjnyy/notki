import { Label } from "@repo/ui/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import NoteCard from "@repo/ui/components/display-notes/note-card";
import useNoteContentSettings from "@repo/lib/hooks/note-settings/use-note-content-settings";
import useNoteFooterSettings from "@repo/lib/hooks/note-settings/use-note-footer-settings";
import useNoteHeaderSettings from "@repo/lib/hooks/note-settings/use-note-header-settings";
import useNotePaddingSettings from "@repo/lib/hooks/note-settings/use-note-padding-settings";
import { useNoteSettings } from "@repo/lib/stores/note-settings-store";
import CheckSetting from "../check-setting";
import { Setting } from "../setting";
import { TabContent, TabTitle } from "../setting-tab";
import SliderSetting from "../slider-setting";

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
                            content:
                                "lorem ipsum some text and stuff.\n New line more stuff.",
                        }}
                    />
                </div>
            </div>
            <Tabs
                defaultValue="header"
                className="border p-3 rounded-[var(--radius)] "
            >
                <TabsList className="mb-4">
                    <TabsTrigger value="header">Header</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                    <TabsTrigger
                        value="padding"
                        className="w-[3.9rem] sm:w-fit "
                    >
                        Padding
                    </TabsTrigger>
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
    );
};
