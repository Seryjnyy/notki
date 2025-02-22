import { ResetButton } from "@repo/ui/components/settings/reset-button"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { Infinity } from "lucide-react"
import { useState } from "react"

import {
  Recent,
  useGetSortedRecents,
  useRecentsStore,
} from "~/stores/recents-store"
import FolderListItem from "./folder-list-item"
import LandingCard from "./landing-card"

import { getFolderNameFromFilepath } from "~/lib/utils"
import { OpenFolderDialogTrigger } from "~/components/sidebar/open-folder-dialog.tsx"
import RecentDropdown from "~/components/sidebar/recent-dropdown.tsx"
import { useUploadNotesFromRecents } from "~/hooks/use-upload-notes-from-recents"

export default function Recents() {
  const clearRecents = useRecentsStore.use.clearRecents()

  return (
    <LandingCard>
      <LandingCard.Title secondary={<ResetButton onClick={clearRecents} />}>
        Recents
      </LandingCard.Title>
      <LandingCard.Content>
        <ScrollArea className="h-[calc(100vh-18rem)] pr-3 ">
          <ul className="pt-4 flex flex-col gap-2">
            <RecentsList />
          </ul>
        </ScrollArea>
      </LandingCard.Content>
      <LandingCard.Footer>
        <OpenFolderDialogTrigger className={"w-full"} />
      </LandingCard.Footer>
    </LandingCard>
  )
}

// TODO : not sure about permissions here ibh, this might only work during a session, then will need to allow again
// unless reads are find, but i doubt it. Last resort can be the tauri persisted permission thingy
const RecentsList = () => {
  const recents = useGetSortedRecents()
  const uploadNotesFromRecents = useUploadNotesFromRecents()

  // TODO : slightly annoying tooltip :/
  // After using dropdown menu and closing it the tooltip stays open
  // showTooltip is used to stop it from showing when dropdown is open, but doesn't fix the above problem
  const [showTooltip, setShowTooltip] = useState(true)

  const handleOpenRecent = async (recent: Recent) => {
    await uploadNotesFromRecents({
      dirs: recent.path,
      recursive: recent.recursive,
    })
  }

  return recents.map((recent) => (
    <li key={recent.path}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FolderListItem>
              <FolderListItem.Header onClick={() => handleOpenRecent(recent)}>
                <FolderListItem.Title>
                  {recent.recursive && (
                    <span className="border-r pr-1">
                      <Infinity className="size-3" />
                    </span>
                  )}
                  {/* TODO : this might only work on windows no??? are filepaths read in the same way regardless of OS?*/}
                  {getFolderNameFromFilepath(recent.path)}
                </FolderListItem.Title>
                <FolderListItem.Desc>{recent.path}</FolderListItem.Desc>
              </FolderListItem.Header>

              <FolderListItem.Action>
                <RecentDropdown
                  recent={recent}
                  onOpenChange={(val) => setShowTooltip(!val)}
                />
              </FolderListItem.Action>
            </FolderListItem>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent side="bottom">
              <p>{recent.path}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </li>
  ))
}
