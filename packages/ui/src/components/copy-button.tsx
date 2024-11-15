import * as React from "react";
import { CheckIcon, ClipboardIcon, Copy } from "lucide-react";

import { Button, ButtonProps } from "@repo/ui/components/ui/button";
import { cn } from "../lib/utils";

interface CopyButtonProps extends ButtonProps {
    value: string;
    src?: string;
}

export async function copyToClipboardWithMeta(value: string, event?: Event) {
    navigator.clipboard.writeText(value);
}

export function CopyButton({
    value,
    className,
    src,
    variant = "ghost",
    ...props
}: CopyButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }, [hasCopied]);

    return (
        <Button
            size="icon"
            variant={variant}
            className={cn("relative z-10", className)}
            onClick={() => {
                console.log("copying");
                copyToClipboardWithMeta(value);
                setHasCopied(true);
            }}
            {...props}
        >
            <span className="sr-only">Copy</span>
            {hasCopied ? <CheckIcon /> : <Copy />}
        </Button>
    );
}
