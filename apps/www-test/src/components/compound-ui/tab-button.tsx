import { Button } from "@repo/ui/components/ui/button";
import { ReactNode } from "react";
import { cn } from "~/lib/utils";

export const TabButton = ({
    icon,
    label,
    isActive,
    setCurrentTab,
    onClick,
}: {
    icon?: ReactNode;
    label: string;
    isActive: boolean;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
    onClick?: () => void;
}) => {
    return (
        <Button
            onClick={() => {
                setCurrentTab(label);
                onClick?.();
            }}
            variant="ghost"
            className={cn(
                "justify-normal gap-2 text-muted-foreground hover:bg-muted hover:text-accent-foreground",
                isActive &&
                    "hover:bg-initial bg-primary/20 text-foreground outline outline-2 outline-primary"
            )}
        >
            {icon}
            {label}
        </Button>
    );
};
