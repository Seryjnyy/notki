import { mapShortcutKey } from "~/lib/utils";
import { useShortcutsStore } from "@repo/lib/stores/shortcuts-store";
import CheckSetting from "../check-setting";
import { Setting } from "../setting";

export default function ShortcutTab() {
    const shortcuts = useShortcutsStore.use.shortcuts();
    const toggleShortcut = useShortcutsStore.use.toggleShortcut();
    const reset = useShortcutsStore.use.reset();

    return (
        <Setting
            title="Hotkeys"
            description="Changes what shortcuts are enabled."
            resetAction={reset}
        >
            <ul className="flex flex-col gap-2">
                {shortcuts.map((shortcut) => (
                    <li key={shortcut.id}>
                        <CheckSetting
                            value={shortcut.enabled}
                            label={shortcut.label}
                            desc={shortcut.hotkeys
                                .map(mapShortcutKey)
                                .join(", ")}
                            onChange={() => {
                                toggleShortcut(shortcut.id);
                            }}
                        />
                    </li>
                ))}
            </ul>
        </Setting>
    );
}
