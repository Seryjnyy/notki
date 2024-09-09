import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetOverlay,
    SheetTitle,
    SheetTrigger,
} from "../../sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../tooltip";
import { RadioGroup, RadioGroupItem } from "../../radio-group";

import { MagnifyingGlassIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "../../button";
import { Input } from "../../input";
import { Label } from "../../label";
import { useSearch } from "@repo/lib/search-store";
import { SearchTarget } from "@repo/lib/types";
import { cn } from "../../../../lib/utils";

export default function Search() {
    const searchTerm = useSearch((state) => state.searchTerm);
    const searchResultCount = useSearch((state) => state.resultCount);
    const setSearchTerm = useSearch((state) => state.setSearchTerm);

    const searchTarget = useSearch((state) => state.searchTarget);
    const setSearchTarget = useSearch((state) => state.setSearchTarget);

    const handleResetSearch = () => {
        setSearchTerm("");
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
                            <MagnifyingGlassIcon />
                            {searchTerm != "" && (
                                <div className="w-1 h-1 bg-primary rounded-full opacity-80 absolute top-1 right-1"></div>
                            )}
                        </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Search</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* <SheetOverlay className="" /> */}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Simple search</SheetTitle>
                    <SheetDescription>
                        Search note content and title for term.
                    </SheetDescription>
                </SheetHeader>
                <div className="border p-2 mt-8 flex flex-col gap-4">
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground ml-auto">
                        {searchResultCount} notes
                    </span>

                    <div className="space-y-2">
                        <span className="text-lg font-semibold">Target</span>
                        <RadioGroup
                            value={searchTarget}
                            onValueChange={(val: SearchTarget) =>
                                setSearchTarget(val)
                            }
                            className="pl-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="content"
                                    id="option-content"
                                />
                                <Label htmlFor="option-content">Content</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="title"
                                    id="option-title"
                                />
                                <Label htmlFor="option-title">Title</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="option-all" />
                                <Label htmlFor="option-all">All</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="border p-2">
                    <Button
                        className="space-x-2 w-full"
                        onClick={handleResetSearch}
                        variant={"secondary"}
                    >
                        <span>Reset search</span> <UpdateIcon />
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
