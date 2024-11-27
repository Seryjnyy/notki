import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { useState } from "react"
import useVaults from "~/hooks/use-vaults"
import FolderListItem from "./folder-list-item"
import LandingCard from "./landing-card"
import { ManageVaultsDialogTrigger } from "~/components/vault-manager/manage-vaults-dialog.tsx"
import VaultDropdown from "~/components/sidebar/vault-dropdown.tsx"
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs.ts"
import { Vault as VaultType } from "~/lib/backend-types.ts"

export default function Vaults() {
  return (
    <LandingCard>
      <LandingCard.Title>Vaults</LandingCard.Title>
      <LandingCard.Content>
        <ScrollArea className="h-[calc(100vh-18rem)] pr-3 ">
          <ul className="pt-4 flex flex-col gap-2">
            <VaultsList />
          </ul>
        </ScrollArea>
      </LandingCard.Content>
      <LandingCard.Footer>
        <ManageVaultsDialogTrigger className={"w-full"} />
      </LandingCard.Footer>
    </LandingCard>
  )
}

const VaultsList = () => {
  const { vaults } = useVaults()
  // TODO : slightly annoying tooltip :/
  // After using dropdown menu and closing it the tooltip stays open
  // showTooltip is used to stop it from showing when dropdown is open, but doesn't fix the above problem
  const [showTooltip, setShowTooltip] = useState(true)
  const uploadNoteFromDirs = useUploadNotesFromDirs()

  // Duplicate code with parent
  const openVault = (vault: VaultType) => {
    uploadNoteFromDirs({
      dirs: [vault.filepath],
      recursive: true,
      replace: true,
    })
  }
  return vaults.map((vault) => (
    <li key={vault.id}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FolderListItem>
              <FolderListItem.Header onClick={() => openVault(vault)}>
                <FolderListItem.Title>{vault.name}</FolderListItem.Title>
                <FolderListItem.Desc>{vault.filepath}</FolderListItem.Desc>
              </FolderListItem.Header>

              <FolderListItem.Action>
                <VaultDropdown
                  vault={vault}
                  onOpenChange={(val) => setShowTooltip(!val)}
                />
              </FolderListItem.Action>
            </FolderListItem>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent side="bottom">
              <p>{vault.filepath}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </li>
  ))
}
