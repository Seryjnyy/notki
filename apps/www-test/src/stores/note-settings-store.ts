import { createSelectors } from "@repo/lib/create-zustand-selectors";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Header = {
    header: boolean;
    title: boolean;
    copy: boolean;
    remove: boolean;
};

const header: Header = {
    header: true,
    title: true,
    copy: true,
    remove: true,
};

type Content = {
    lineHeight: number;
    letterSpacing: number;
    fontSize: number;
    textSelectable: boolean;
};

const content: Content = {
    lineHeight: 1.5,
    letterSpacing: 0,
    fontSize: 16,
    textSelectable: true,
};

type Footer = {
    metadata: boolean;
    size: boolean;
    lastModified: boolean;
    characterCount: boolean;
};

const footer: Footer = {
    metadata: true,
    size: true,
    lastModified: true,
    characterCount: true,
};

type State = {
    header: Header;
    content: Content;
    footer: Footer;
    padding: Padding;
};

type Padding = {
    paddingX: number;
    paddingTop: number;
    paddingBottom: number;
};

const padding: Padding = {
    paddingX: 24,
    paddingTop: 4,
    paddingBottom: 4,
};

export const defaults = { header, content, footer, padding };

interface Actions {
    reset: () => void;
    setHeader: (header: Header) => void;
    setContent: (content: Content) => void;
    setFooter: (footer: Footer) => void;
    setPadding: (padding: Padding) => void;
    resetHeader: () => void;
    resetContent: () => void;
    resetFooter: () => void;
    resetPadding: () => void;
}

const useNoteSettingsBase = create<State & Actions>()(
    persist(
        (set) => ({
            ...defaults,
            setHeader: (header) => set({ header }),
            setContent: (content) => set({ content }),
            setFooter: (footer) => set({ footer }),
            setPadding: (padding) => set({ padding }),
            reset: () => set(defaults),
            resetHeader: () => set({ header }),
            resetContent: () => set({ content }),
            resetFooter: () => set({ footer }),
            resetPadding: () => set({ padding }),
        }),
        {
            name: "note-settings",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useNoteSettings = createSelectors(useNoteSettingsBase);

export { useNoteSettings };
