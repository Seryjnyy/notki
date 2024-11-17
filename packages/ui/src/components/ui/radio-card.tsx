import { HTMLAttributes } from "react";
import { cn } from "@repo/ui/lib/utils";

type RadioTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const RadioCardTitle = (props: RadioTitleProps) => {
    return (
        <h2
            className={cn("text-xl text-foreground", props.className)}
            {...props}
        />
    );
};

export const RadioCardDescription = (props: RadioTitleProps) => {
    return (
        <h2
            className={cn("text-muted-foreground", props.className)}
            {...props}
        />
    );
};

type RadioCardContentProps = HTMLAttributes<HTMLDivElement>;

export const RadioCardContent = (props: RadioCardContentProps) => {
    return <div {...props} />;
};

export type RadioCardProps = HTMLAttributes<HTMLButtonElement> & {
    isActive: boolean;
};
export const RadioCard = ({
    isActive,
    className,
    ...props
}: RadioCardProps) => {
    return (
        <button
            className={cn(
                "cursor-pointer rounded-md px-4 py-2 text-left outline outline-1 outline-foreground/20 transition-all hover:bg-foreground/5 hover:outline-foreground focus:outline-2 focus:outline-foreground",
                {
                    "focus:outline-initial bg-primary/10 outline-2 focus:outline-4 outline-primary":
                        isActive,
                },
                className
            )}
            {...props}
        />
    );
};
