import { ResetIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import { ComponentProps } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

type ResetButtonProps = ComponentProps<typeof Button>;

export const ResetButton = (props: ResetButtonProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button variant="ghost" size="icon" {...props}>
                        <ResetIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reset</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
