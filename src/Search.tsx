import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { useSearch } from "./lib/search-store";
import { SearchTarget } from "./lib/types";

export default function Search() {
  const searchTerm = useSearch((state) => state.searchTerm);
  const searchResultCount = useSearch((state) => state.resultCount);
  const setSearchTerm = useSearch((state) => state.setSearchTerm);

  const searchTarget = useSearch((state) => state.searchTarget);
  const setSearchTarget = useSearch((state) => state.setSearchTarget);

  return (
    <>
      <Sheet>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
                <MagnifyingGlassIcon />
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>Search note content for term.</SheetDescription>
          </SheetHeader>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResultCount} items
          <RadioGroup
            value={searchTarget}
            onValueChange={(val: SearchTarget) => setSearchTarget(val)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="content" id="option-content" />
              <Label htmlFor="option-content">content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="title" id="option-title" />
              <Label htmlFor="option-title">title</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="option-all" />
              <Label htmlFor="option-all">all</Label>
            </div>
          </RadioGroup>
        </SheetContent>
      </Sheet>
    </>
  );
}
