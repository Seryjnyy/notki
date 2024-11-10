import React, { useMemo } from "react";
import { defaults, useNoteSettings } from "~/stores/note-settings-store";

export default function useNotePaddingSettings() {
    const padding = useNoteSettings.use.padding();
    const setPadding = useNoteSettings.use.setPadding();
    const resetPadding = useNoteSettings.use.resetPadding();

    const limits = useMemo(() => {
        return {
            paddingX: { max: 60, min: 0 },
            paddingTop: { max: 60, min: 0 },
            paddingBottom: { max: 60, min: 0 },
        } as const;
    }, []);

    const updatePaddingX = React.useCallback(
        (size: number) => {
            if (size < limits.paddingX.min || size > limits.paddingX.max)
                return;

            setPadding({ ...padding, paddingX: size });
        },
        [padding, setPadding]
    );

    const updatePaddingTop = React.useCallback(
        (size: number) => {
            if (size < limits.paddingTop.min || size > limits.paddingTop.max)
                return;

            setPadding({ ...padding, paddingTop: size });
        },
        [padding, setPadding]
    );

    const updatePaddingBottom = React.useCallback(
        (size: number) => {
            if (
                size < limits.paddingBottom.min ||
                size > limits.paddingBottom.max
            )
                return;

            setPadding({ ...padding, paddingBottom: size });
        },
        [padding, setPadding]
    );
    const resetPaddingTop = React.useCallback(() => {
        setPadding({ ...padding, paddingTop: defaults.padding.paddingTop });
    }, [defaults.padding.paddingTop, setPadding, padding]);

    const resetPaddingBottom = React.useCallback(() => {
        setPadding({
            ...padding,
            paddingBottom: defaults.padding.paddingBottom,
        });
    }, [defaults.padding.paddingBottom, setPadding, padding]);

    const resetPaddingX = React.useCallback(() => {
        setPadding({ ...padding, paddingX: defaults.padding.paddingX });
    }, [defaults.padding.paddingX, setPadding, padding]);

    return {
        padding,
        limits,
        updatePaddingX,
        updatePaddingTop,
        updatePaddingBottom,
        resetPadding,
        resetPaddingTop,
        resetPaddingBottom,
        resetPaddingX,
    };
}
