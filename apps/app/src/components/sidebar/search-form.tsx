import { Search } from "lucide-react"

import { Label } from "@repo/ui/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@repo/ui/components/ui/sidebar"
import { useSidebarCurrentView } from "~/components/sidebar/app-sidebar-context.tsx"

export function SearchCurrentViewForm({
  ...props
}: React.ComponentProps<"form">) {
  const { currentView, search, setSearch } = useSidebarCurrentView()
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder={`Search ${currentView}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
