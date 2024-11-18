import React, { useMemo } from "react";
import {
    defaults,
    useNoteSettings,
} from "@repo/lib/stores/note-settings-store";

// TODO : not using line height cause we calculate line height from font size
export default function useNoteFooterSettings() {
    const content = useNoteSettings.use.content();
    const setContent = useNoteSettings.use.setContent();
    const resetContent = useNoteSettings.use.resetContent();

    const limits = useMemo(() => {
        return {
            fontSize: { max: 36, min: 12 },
            letterSpacing: { max: 5, min: 0 },
        } as const;
    }, []);

    const toggleTextSelectable = React.useCallback(() => {
        setContent({ ...content, textSelectable: !content.textSelectable });
    }, [content]);

    const updateFontSize = React.useCallback(
        (size: number) => {
            if (size < limits.fontSize.min || size > limits.fontSize.max)
                return;

            setContent({ ...content, fontSize: size });
        },
        [content, setContent]
    );

    const updateLetterSpacing = React.useCallback(
        (size: number) => {
            if (
                size < limits.letterSpacing.min ||
                size > limits.letterSpacing.max
            )
                return;

            setContent({ ...content, letterSpacing: size });
        },
        [content, setContent]
    );

    const resetLineHeight = React.useCallback(() => {
        setContent({ ...content, lineHeight: defaults.content.lineHeight });
    }, [defaults.content.lineHeight, content, setContent]);

    const resetFontSize = React.useCallback(() => {
        setContent({ ...content, fontSize: defaults.content.fontSize });
    }, [defaults.content.fontSize, content, setContent]);

    const resetLetterSpacing = React.useCallback(() => {
        setContent({
            ...content,
            letterSpacing: defaults.content.letterSpacing,
        });
    }, [defaults.content.letterSpacing, content, setContent]);

    return {
        content,
        limits,
        toggleTextSelectable,
        updateFontSize,
        updateLetterSpacing,
        resetContent,
        resetLineHeight,
        resetLetterSpacing,
        resetFontSize,
    };
}
