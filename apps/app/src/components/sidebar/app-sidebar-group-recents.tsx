import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import * as React from "react"
import { Recent, useGetSortedRecents } from "~/stores/recents-store"
import FolderListItem from "../landing/folder-list-item"

import { getFolderNameFromFilepath } from "~/lib/utils"
import RecentDropdown from "~/components/sidebar/recent-dropdown.tsx"
import { useSidebarCurrentView } from "~/components/sidebar/app-sidebar-context.tsx"
import { useUploadNotesFromRecents } from "~/hooks/use-upload-notes-from-recents"

export default function SidebarGroupRecents() {
  const { search } = useSidebarCurrentView()
  const sortedRecents = useGetSortedRecents()

  const filteredRecents = React.useMemo(() => {
    return sortedRecents.filter((item) => {
      return item.path.toLowerCase().includes(search.toLowerCase())
    })
  }, [sortedRecents, search])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        <span className={search != "" ? "text-primary" : ""}>Recents</span>
        <span>{filteredRecents.length}</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="space-y-4">
        <SidebarMenu>
          <RecentsList recents={filteredRecents} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const RecentsList = ({ recents }: { recents: Recent[] }) => {
  return recents.map((item) => <RecentItem recent={item} key={item.path} />)
}

// Very similar code to the vault list item
const RecentItem = ({ recent }: { recent: Recent }) => {
  const [showTooltip, setShowTooltip] = React.useState(true)
  const uploadNotesFromRecents = useUploadNotesFromRecents()

  // Duplicate code with recent-dropdown
  const openFolder = async (recent: Recent) => {
    await uploadNotesFromRecents({
      dirs: [recent.path],
      recursive: recent.recursive ?? false,
      replace: true,
    })
  }

  const folderName = React.useMemo(
    () => getFolderNameFromFilepath(recent.path),
    [recent.path]
  )
  return (
    <SidebarMenuItem key={recent.path}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton isActive={false} asChild className="py-2 h-fit">
              <div className="grid grid-cols-6">
                <FolderListItem.Header onClick={() => openFolder(recent)}>
                  <FolderListItem.Title>{folderName}</FolderListItem.Title>
                  <FolderListItem.Desc>{recent.path}</FolderListItem.Desc>
                </FolderListItem.Header>

                <FolderListItem.Action>
                  <RecentDropdown
                    recent={recent}
                    onOpenChange={(val) => setShowTooltip(!val)}
                  />
                </FolderListItem.Action>
              </div>
            </SidebarMenuButton>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent side="bottom">
              <p>{recent.path}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  )
}
