import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Theme } from "./styles/themes/theme.type";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const applyTheme = (style: string) => {
    import(`~/lib/styles/themes/theme_${style}.ts`)
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
