import {
    SortBy as SortByType,
    SortOrder,
    useNoteFilterStore,
} from "@repo/lib/stores/note-store";
import {
    AVAILABLE_SHORTCUTS,
    useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store";
import { NavigationAwareDialog } from "@repo/ui/components/navigation-aware-components";
import ShortcutAwareDialogTrigger from "@repo/ui/components/shortcut/shortcut-aware-dialog-trigger";
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys";
import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { RadioCard, RadioCardTitle } from "@repo/ui/components/ui/radio-card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Filter } from "lucide-react";
import { ReactNode } from "react";
const Order = () => {
    const sortOrder = useNoteFilterStore.use.sortOrder();
    const setSortOrder = useNoteFilterStore.use.setSortOrder();

    const sortOrderOptions: Array<{
        value: SortOrder;
        label: string;
        icon: ReactNode;
    }> = [
        { value: "asc", label: "Asc", icon: <ArrowUpNarrowWide /> },
        { value: "desc", label: "Desc", icon: <ArrowDownWideNarrow /> },
    ];

    return (
        <div>
            <Label htmlFor="sort-order-options">Order</Label>
            <div
                id={"sort-order-options"}
                className="flex items-center gap-2 flex-wrap"
            >
                {sortOrderOptions.map((option) => (
                    <RadioCard
                        isActive={option.value == sortOrder}
                        key={option.value}
                        onClick={() => setSortOrder(option.value)}
                    >
                        <RadioCardTitle className="flex items-center gap-2 ">
                            {option.icon}
                            {option.label}
                        </RadioCardTitle>
                    </RadioCard>
                ))}
            </div>
        </div>
    );
};

const SortBy = () => {
    const sortBy = useNoteFilterStore.use.sortBy();
    const setSortBy = useNoteFilterStore.use.setSortBy();

    const sortByOptions: Array<{ value: SortByType; label: string }> = [
        { value: "time", label: "Time" },
        { value: "title", label: "Title" },
        { value: "size", label: "Size" },
        { value: "characterCount", label: "Character count" },
    ];

    return (
        <div>
            <Label htmlFor="sort-by-options">Sort by</Label>
            <div
                id={"sort-by-options"}
                className="flex items-center gap-2 flex-wrap"
            >
                {sortByOptions.map((option) => (
                    <RadioCard
                        isActive={option.value == sortBy}
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                    >
                        <RadioCardTitle>{option.label}</RadioCardTitle>
                    </RadioCard>
                ))}
            </div>
        </div>
    );
};

export default function FilterSortDialog() {
    const sortBy = useNoteFilterStore.use.sortBy();
    const toggleFilterSortDialogShortcut = useShortcutInfo(
        AVAILABLE_SHORTCUTS.TOGGLE_FILTER
    );

    const isSortChanged = sortBy != "time";

    return (
        <NavigationAwareDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ShortcutAwareDialogTrigger
                            asChild
                            shortcut={toggleFilterSortDialogShortcut}
                        >
                            <Button variant={"ghost"} className="relative">
                                <Filter />
                                {isSortChanged && (
                                    <div className="w-1 h-1 bg-primary rounded-full opacity-80 absolute top-1 right-1"></div>
                                )}
                            </Button>
                        </ShortcutAwareDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>
                            Filter and sort{" "}
                            <TooltipShortcutKeys
                                shortcut={toggleFilterSortDialogShortcut}
                            />
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent dialogOverlayVariant={{ variant: "partialOverlay" }}>
                <DialogHeader>
                    <DialogTitle>Sort</DialogTitle>
                    <DialogDescription className="sr-only">
                        Sort your notes by time, title, size, or character
                        count.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex  flex-col gap-3 pt-2">
                    <SortBy />
                    <Order />
                </div>
            </DialogContent>
        </NavigationAwareDialog>
    );
}
