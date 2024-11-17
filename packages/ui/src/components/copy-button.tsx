import { CheckIcon, Copy } from "lucide-react";
import * as React from "react";

import { Button, ButtonProps } from "@repo/ui/components/ui/button";
import { cn } from "../lib/utils";

interface CopyButtonProps extends ButtonProps {
    value: string;
    src?: string;
}

export async function copyToClipboard(value: string, event?: Event) {
    navigator.clipboard.writeText(value);
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
    ({ value, className, onClick, src, variant = "ghost", ...props }, ref) => {
        const [hasCopied, setHasCopied] = React.useState(false);

        React.useEffect(() => {
            setTimeout(() => {
                setHasCopied(false);
            }, 2000);
        }, [hasCopied]);

        return (
            <Button
                ref={ref}
                size="icon"
                variant={variant}
                className={cn("relative z-10", className)}
                onClick={(e) => {
                    copyToClipboard(value);
                    setHasCopied(true);
                    onClick?.(e);
                }}
                {...props}
            >
                <span className="sr-only">Copy</span>
                {hasCopied ? <CheckIcon /> : <Copy />}
            </Button>
        );
    }
);

CopyButton.displayName = "CopyButton";
