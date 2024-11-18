import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../sheet";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { buttonVariants } from "../../button";
import { Label } from "../../label";
import { RadioGroup, RadioGroupItem } from "../../radio-group";
import { usePreferenceStore } from "@repo/lib/stores/preference-store";
import { Order, SortBy } from "@repo/lib/types/types";
import { cn } from "../../../../lib/utils";

export default function FilterAndSort() {
    const settings = usePreferenceStore((state) => state.settings);
    const setSettings = usePreferenceStore((state) => state.setSettings);

    const onOrderChange = (newOrder: Order) => {
        setSettings(
            produce(settings, (draft) => {
                draft.sort.order = newOrder;
            })
        );
    };

    const onSortByChange = (newSortBy: SortBy) => {
        setSettings(
            produce(settings, (draft) => {
                draft.sort.sortBy = newSortBy;
            })
        );
    };

    return (
        <Sheet>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SheetTrigger
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "relative"
                            )}
                        >
                            <MixerVerticalIcon />
                            {settings.sort.sortBy != "none" && (
                                <div className="w-1 h-1 bg-primary rounded-full opacity-80 absolute top-1 right-1"></div>
                            )}
                        </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Filter and sort</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-xl text-muted-foreground">
                        Filter
                    </SheetTitle>
                </SheetHeader>
                <div className="pt-4">
                    <div className="p-2">
                        <div className="text-lg font-semibold">Sort by</div>
                        <RadioGroup
                            value={settings.sort.sortBy}
                            onValueChange={(val: SortBy) => onSortByChange(val)}
                            className="pl-4 pt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="option-none" />
                                <Label htmlFor="option-none">None</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="time" id="option-time" />
                                <Label htmlFor="option-time">Time</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className=" p-2">
                        <div className="text-lg font-semibold">Order</div>
                        <RadioGroup
                            value={settings.sort.order}
                            onValueChange={(val: Order) => onOrderChange(val)}
                            className="pl-4 pt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="asc" id="option-asc" />
                                <Label htmlFor="option-asc">Asc</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="desc" id="option-desc" />
                                <Label htmlFor="option-desc">Desc</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {/* <Button onClick={sortNotes}>Sort</Button> */}
            </SheetContent>
        </Sheet>
    );
}
