import React from "react";
import { useNoteSettings } from "~/stores/note-settings-store";

export default function useNoteHeaderSettings() {
    const header = useNoteSettings.use.header();
    const setHeader = useNoteSettings.use.setHeader();
    const resetHeader = useNoteSettings.use.resetHeader();

    const toggleHeader = React.useCallback(() => {
        setHeader({ ...header, header: !header.header });
    }, [header]);

    const toggleTitle = React.useCallback(() => {
        setHeader({ ...header, title: !header.title });
    }, [header]);

    const toggleRemove = React.useCallback(() => {
        setHeader({ ...header, remove: !header.remove });
    }, [header]);

    const toggleCopy = React.useCallback(() => {
        setHeader({ ...header, copy: !header.copy });
    }, [header]);

    return {
        header,
        toggleHeader,
        toggleCopy,
        toggleRemove,
        toggleTitle,
        resetHeader,
    };
}
