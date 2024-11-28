import { mapShortcutKey } from "@repo/ui/lib/utils";
import { Shortcut, useShortcutsStore } from "@repo/lib/stores/shortcuts-store";
import CheckSetting from "../check-setting";
import { Setting } from "../setting";
import { Button } from "@repo/ui/components/ui/button";

export default function ShortcutTab({
    extraShortcuts = [],
}: {
    extraShortcuts?: Shortcut[];
}) {
    const shortcuts = useShortcutsStore.use.sharedShortcuts();
    const toggleShortcut = useShortcutsStore.use.toggleShortcut();
    const reset = useShortcutsStore.use.reset();

    const turnOnAllShortcuts = () => {
        shortcuts.forEach((shortcut) => {
            toggleShortcut(shortcut.id, true);
        });
    };

    const turnOffAllShortcuts = () => {
        shortcuts.forEach((shortcut) => {
            toggleShortcut(shortcut.id, false);
        });
    };

    return (
        <Setting
            title="Hotkeys"
            description="Changes what shortcuts are enabled."
            resetAction={reset}
        >
            <ul className="flex flex-col gap-2">
                <div className="w-full flex justify-between">
                    <Button variant={"outline"} onClick={turnOnAllShortcuts}>
                        Turn on all shortcuts
                    </Button>
                    <Button variant={"outline"} onClick={turnOffAllShortcuts}>
                        Turn off all shortcuts
                    </Button>
                </div>
                {[...shortcuts, ...extraShortcuts].map((shortcut) => (
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
