import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFilteredNotes, useNoteFilterStore } from "@repo/lib/note-store";
import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { Search } from "lucide-react";
import { NavigationAwareDialog } from "~/components/compound-ui/navigation-aware-components";
import { Input } from "~/components/ui/input";
import { RadioCard, RadioCardTitle } from "~/components/ui/radio-card";

type SearchIn = "title" | "content" | "both";

const SearchOptions = () => {
    const searchIn = useNoteFilterStore.use.searchIn();
    const setSearchIn = useNoteFilterStore.use.setSearchIn();

    const searchOptions: Array<{ value: SearchIn; label: string }> = [
        { value: "title", label: "Title" },
        { value: "content", label: "Content" },
        { value: "both", label: "Both" },
    ];

    return (
        <div>
            <Label htmlFor="sort-by-options">Search in</Label>
            <div
                id={"sort-by-options"}
                className="flex items-center gap-2 flex-wrap"
            >
                {searchOptions.map((option) => (
                    <RadioCard
                        isActive={option.value == searchIn}
                        key={option.value}
                        onClick={() => setSearchIn(option.value)}
                    >
                        <RadioCardTitle>{option.label}</RadioCardTitle>
                    </RadioCard>
                ))}
            </div>
        </div>
    );
};

export default function SearchDialog() {
    const filter = useNoteFilterStore.use.filter();
    const setFilter = useNoteFilterStore.use.setFilter();
    const filteredNotes = useFilteredNotes();

    return (
        <NavigationAwareDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant={"ghost"} className="relative">
                                <Search />
                                {filter != "" && (
                                    <div className="w-1 h-1 bg-primary rounded-full opacity-80 absolute top-1 right-1"></div>
                                )}
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>Search</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent dialogOverlayVariant={{ variant: "partialOverlay" }}>
                <DialogHeader>
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription className="sr-only">
                        Search for notes by title, content or both.
                    </DialogDescription>
                    <div className="pt-2 flex flex-col gap-6">
                        <Input
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            startIcon={<MagnifyingGlassIcon />}
                            className="bg w-full border border-border"
                        />
                        <SearchOptions />
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <div className="text-xs text-muted-foreground">
                        {filteredNotes.length} notes found
                    </div>
                </DialogFooter>
            </DialogContent>
        </NavigationAwareDialog>
    );
}
