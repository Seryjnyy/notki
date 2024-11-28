import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar"
import * as React from "react"
import { Vault as VaultType } from "~/lib/backend-types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { useUploadNotesFromDirs } from "~/hooks/use-upload-notes-from-dirs"
import useVaults from "~/hooks/use-vaults"
import FolderListItem from "../landing/folder-list-item"
import { useSidebarCurrentView } from "~/components/sidebar/app-sidebar-context.tsx"
import VaultDropdown from "~/components/sidebar/vault-dropdown.tsx"

export default function SidebarGroupVaults() {
  const { search } = useSidebarCurrentView()
  const { vaults } = useVaults()

  const filteredVaults = React.useMemo(() => {
    return vaults.filter((item) => {
      return item.filepath.toLowerCase().includes(search.toLowerCase())
    })
  }, [vaults, search])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        <span className={search != "" ? "text-primary" : ""}>Vaults</span>
        <span>{filteredVaults.length}</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="space-y-4">
        <SidebarMenu>
          <VaultsList vaults={filteredVaults} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const VaultItem = ({ vault }: { vault: VaultType }) => {
  const [showTooltip, setShowTooltip] = React.useState(true)
  const uploadNoteFromDirs = useUploadNotesFromDirs()

  // Vault dropdown also defines this function, duplicate code
  const openVault = (vault: VaultType) => {
    uploadNoteFromDirs({
      dirs: [vault.filepath],
      recursive: true,
      replace: true,
    })
  }

  return (
    <SidebarMenuItem key={vault.filepath}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton isActive={false} asChild className="py-2 h-fit">
              <div className="grid grid-cols-6">
                <FolderListItem.Header onClick={() => openVault(vault)}>
                  <FolderListItem.Title>{vault.name}</FolderListItem.Title>
                  <FolderListItem.Desc>{vault.filepath}</FolderListItem.Desc>
                </FolderListItem.Header>

                <FolderListItem.Action>
                  <VaultDropdown
                    onOpenChange={(val) => setShowTooltip(!val)}
                    vault={vault}
                  />
                </FolderListItem.Action>
              </div>
            </SidebarMenuButton>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent side="bottom">
              <p>{vault.filepath}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  )
}

const VaultsList = ({ vaults }: { vaults: VaultType[] }) => {
  return vaults.map((item) => <VaultItem vault={item} key={item.id} />)
}
