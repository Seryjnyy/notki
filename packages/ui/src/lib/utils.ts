import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Theme } from "../styles/themes/theme.type";
import { theme_8008 } from "../styles/themes/theme_8008";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const mapShortcutKey = (hotkey: string) => {
    if (hotkey === "down") return "down arrow key";
    if (hotkey === "up") return "up arrow key";
    if (hotkey === "left") return "left arrow key";
    if (hotkey === "right") return "right arrow key";

    if (hotkey.includes("+")) return hotkey + " keys";

    return hotkey + " key";
};

export const formatHotKeys = (hotkeys: string[]) => {
    return hotkeys.map(mapShortcutKey).join(" or ");
};

export const applyTheme = (style: string) => {
    import(`../styles/themes/theme_${style}.ts`)
        .then((module) => module["theme_" + style])
        .then((theme) => {
            const root = document.documentElement;
            Object.keys(theme).forEach((key) => {
                root.style.setProperty(key, theme[key as keyof Theme]);
            });
        });
};

export const formatThemeName = (name: string) => {
    let formattedName = name.replace(/_/g, " ");
    formattedName =
        formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    return formattedName;
};

export function generateFontCss(font: string): string {
    return `${font},Roboto Mono,monospace,-apple-system,system-ui,Avenir,Helvetica,Arial,sans-serif`;
}
