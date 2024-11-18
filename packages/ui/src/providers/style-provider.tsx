import { useEffect } from "react";

import { applyTheme, generateFontCss } from "@repo/ui/lib/utils";
import { useAllFonts, useStyleStore } from "@repo/lib/stores/style-store";

// TODO : not sure how efficient this is, but it works for now
// TODO : should be default export no?
export const StyleProvider = () => {
    const root = document.documentElement;
    const reset = useStyleStore.use.reset();
    const currentFont = useStyleStore.use.font();

    const style = useStyleStore.use.style();
    const allFonts = useAllFonts();

    useEffect(() => {
        if (!allFonts.some((font) => font === currentFont)) {
            reset(["font"]);
        }
    }, [allFonts]);

    const borderRadius = useStyleStore.use.borderRadius();

    useEffect(() => {
        root.attributeStyleMap.set("--radius", `${borderRadius}px`);
    }, [borderRadius]);

    useEffect(() => {
        root.style.fontFamily = generateFontCss(currentFont);
    }, [currentFont]);

    useEffect(() => {
        applyTheme(style);
    }, [style]);

    return null;
};
