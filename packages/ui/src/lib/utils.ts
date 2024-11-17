import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
