// Copied from Shadcn/ui
import { Style } from "./styles";
import { Theme } from "./themes";
import { create } from "zustand";

type Config = {
  style: Style["name"];
  theme: Theme["name"];
  radius: number;
  noteFontColour: string;
  setStyle: (val: Style["name"]) => void;
  setTheme: (val: Theme["name"]) => void;
  setRadius: (val: number) => void;
  setNoteFontColour: (val: string) => void;
};

const getStoredThemeColour = () => {
  const themeColour = localStorage.getItem("vite-ui-theme-colour");

  if (!themeColour) return "zinc";

  return themeColour as Theme["name"];
};

const useConfig = create<Config>()((set) => ({
  style: "default",
  noteFontColour:
    localStorage.getItem("vite-ui-theme-note-font-colour") ?? "primary",
  theme: getStoredThemeColour(),
  radius: 0.5,
  setRadius: (val) => set(() => ({ radius: val })),
  setTheme: (val) =>
    set(() => {
      localStorage.setItem("vite-ui-theme-colour", val);
      return { theme: val };
    }),
  setStyle: (val) => set(() => ({ style: val })),
  setNoteFontColour: (val) =>
    set(() => {
      localStorage.setItem("vite-ui-theme-note-font-colour", val);
      return { noteFontColour: val };
    }),
}));

export { useConfig };
