import { DialogTrigger } from "@repo/ui/components/ui/dialog";
import React, { useRef } from "react";
import useToggleDialogShortcut from "@repo/lib/hooks/use-toggle-dialog-shortcut";
import { Shortcut } from "@repo/lib/stores/shortcuts-store";
import { Trigger } from "@radix-ui/react-dialog";

interface ShortcutAwareDialogTriggerProps
    extends React.ComponentPropsWithoutRef<typeof Trigger> {
    shortcut?: Shortcut;
}

// Utility to merge refs, incase it is needed
// TODO : not tested fully
function mergeRefs<T>(...refs: (React.Ref<T> | null | undefined)[]) {
    return (value: T) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T>).current = value;
            }
        });
    };
}

const ShortcutAwareDialogTrigger = React.forwardRef<
    HTMLButtonElement,
    ShortcutAwareDialogTriggerProps
>(({ shortcut, children, ...props }, forwardedRef) => {
    const triggerRef = useRef<HTMLButtonElement>(null);

    useToggleDialogShortcut(shortcut, triggerRef);

    return (
        <DialogTrigger ref={mergeRefs(triggerRef, forwardedRef)} {...props}>
            {children}
        </DialogTrigger>
    );
});

ShortcutAwareDialogTrigger.displayName = "ShortcutAwareDialogTrigger";

export default ShortcutAwareDialogTrigger;
