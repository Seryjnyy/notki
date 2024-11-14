import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { NavigationAwareDialog } from "~/components/compound-ui/navigation-aware-components";
// import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/ui/toggle-group";

export default function FilterSortDialog() {
    return (
        <NavigationAwareDialog>
            <DialogTrigger>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant={"ghost"} className="relative">
                                <MixerVerticalIcon />
                                {/* {settings.sort.sortBy != "none" && (
                                <div className="w-1 h-1 bg-primary rounded-full opacity-80 absolute top-1 right-1"></div>
                            )} */}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Filter and sort</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sort</DialogTitle>
                    <DialogDescription>
                        TODO : add description
                    </DialogDescription>
                </DialogHeader>

                {/* <ToggleGroup type="single">
                    <ToggleGroupItem value="a">A</ToggleGroupItem>
                    <ToggleGroupItem value="b">B</ToggleGroupItem>
                    <ToggleGroupItem value="c">C</ToggleGroupItem>
                </ToggleGroup> */}
            </DialogContent>
        </NavigationAwareDialog>
    );
}
