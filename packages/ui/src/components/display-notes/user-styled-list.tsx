import { ReactNode } from "react";
import { useNoteDisplaySettings } from "@repo/lib/stores/note-display-settings-store";

export default function UserStyledList({ children }: { children: ReactNode }) {
    const cols = useNoteDisplaySettings.use.cols();
    const colsGap = useNoteDisplaySettings.use.colsGap();
    const paddingX = useNoteDisplaySettings.use.paddingX();
    const paddingY = useNoteDisplaySettings.use.paddingY();

    return (
        <ul
            className="grid"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: `${colsGap}px`,
                padding: `${paddingY}px ${paddingX}px`,
            }}
        >
            {children}
        </ul>
    );
}
