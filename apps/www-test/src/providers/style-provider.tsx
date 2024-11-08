import {
    useBorderRadius,
    useFont,
    useStyle,
    useUserFonts,
} from "~/atoms/atoms";
import { useEffect } from "react";
import { applyTheme, generateFontCss } from "~/lib/utils";
import { DEFAULT_FONT, FONTS } from "~/config/fonts.config";

export const StyleProvider = () => {
    const root = document.documentElement;
    const [currentFont, setCurrentFont] = useFont();
    const [userFonts] = useUserFonts();
    const [style] = useStyle();
    const [radius] = useBorderRadius();

    useEffect(() => {
        const fontCollection = [...userFonts, ...FONTS];
        if (!fontCollection.some((font) => font === currentFont)) {
            setCurrentFont(DEFAULT_FONT);
        }
    }, [userFonts, currentFont]);

    useEffect(() => {
        root.attributeStyleMap.set("--radius", `${radius}px`);
    }, [radius]);

    useEffect(() => {
        root.style.fontFamily = generateFontCss(currentFont);
    }, [currentFont]);

    useEffect(() => {
        applyTheme(style);
    }, [style]);

    return <></>;
};
