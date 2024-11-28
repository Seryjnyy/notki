import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// TODO : this might only work on windows no??? are filepaths read in the same way regardless of OS?
export function getFolderNameFromFilepath(filepath: string) {
    return filepath.split("\\").pop();
}
