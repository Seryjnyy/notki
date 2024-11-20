import React from "react";
import { cn } from "~/lib/utils";

const Desc = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "text-sm text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap max-w-[100%]",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

Desc.displayName = "Desc";

const Action = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn("flex justify-end items-center ", className)}
            {...props}
        >
            {children}
        </div>
    );
};

Action.displayName = "Action";

const Header = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "text-ellipsis overflow-hidden whitespace-nowrap max-w-[100%] flex items-center gap-1",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

Header.displayName = "Header";

const Title = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "text-ellipsis overflow-hidden whitespace-nowrap max-w-[100%] flex items-center gap-1",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

Title.displayName = "Title";

interface FolderListItemComposition {
    Header: typeof Header;
    Title: typeof Title;
    Desc: typeof Desc;
    Action: typeof Action;
}

const FolderListItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "bg-secondary px-4 py-2 w-full rounded-[var(--radius)] grid grid-cols-6 cursor-pointer hover:brightness-150",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}) as React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> &
    FolderListItemComposition;

FolderListItem.displayName = "FolderListItem";

FolderListItem.Header = Header;
FolderListItem.Title = Title;
FolderListItem.Desc = Desc;
FolderListItem.Action = Action;

export default FolderListItem;
