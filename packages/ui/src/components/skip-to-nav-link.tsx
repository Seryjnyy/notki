import { cn } from "../lib/utils";

export default function SkipToNavLink({ className }: { className?: string }) {
    return (
        <a
            href="#main-nav"
            className={cn(
                "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-2 focus:bg-background focus:z-50 focus:border",
                className
            )}
        >
            Skip to navigation
        </a>
    );
}
