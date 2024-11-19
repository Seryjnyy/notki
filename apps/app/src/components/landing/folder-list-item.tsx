import React from "react";
import { cn } from "~/lib/utils";

interface FolderListItemProps extends React.HTMLAttributes<HTMLDivElement> {}

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

const Header = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn("flex flex-col items-start col-span-5", className)}
            {...props}
        >
            {children}
        </div>
    );
};

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

export default function FolderListItem({
    children,
    className,
    ...props
}: FolderListItemProps) {
    return (
        <div
            className={cn(
                "bg-secondary px-4 py-2 w-full rounded-[var(--radius)] grid grid-cols-6 cursor-pointer hover:brightness-150",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

FolderListItem.Header = Header;
FolderListItem.Title = Title;
FolderListItem.Desc = Desc;
FolderListItem.Action = Action;
