import React from "react";
import { useNoteSettings } from "@repo/lib/stores/note-settings-store";

export default function useNoteFooterSettings() {
    const footer = useNoteSettings.use.footer();
    const setFooter = useNoteSettings.use.setFooter();
    const resetFooter = useNoteSettings.use.resetFooter();

    const toggleFooter = React.useCallback(() => {
        setFooter({ ...footer, metadata: !footer.metadata });
    }, [footer]);

    const toggleCharacterCount = React.useCallback(() => {
        setFooter({ ...footer, characterCount: !footer.characterCount });
    }, [footer]);

    const toggleLastModified = React.useCallback(() => {
        setFooter({ ...footer, lastModified: !footer.lastModified });
    }, [footer]);

    const toggleSize = React.useCallback(() => {
        setFooter({ ...footer, size: !footer.size });
    }, [footer]);

    return {
        footer,
        toggleFooter,
        toggleSize,
        toggleLastModified,
        toggleCharacterCount,
        resetFooter,
    };
}
