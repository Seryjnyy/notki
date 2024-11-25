import {
  AVAILABLE_SHORTCUTS,
  useShortcutInfo,
} from "@repo/lib/stores/shortcuts-store"
import TooltipShortcutKeys from "@repo/ui/components/shortcut/tooltip-shortcut-keys"
import { Button } from "@repo/ui/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog"
import { InputWithIcons } from "@repo/ui/components/ui/input-with-icons"
import { Label } from "@repo/ui/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@repo/ui/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip"
import { useNavigationLock } from "@repo/ui/hooks/use-navigation-lock"
import { atom, useAtom } from "jotai"
import {
  ArchiveIcon,
  ArrowRight,
  ChevronDown,
  GalleryVerticalEnd,
  Pencil,
  PlusIcon,
  Save,
  Trash2,
  VaultIcon,
  XIcon,
} from "lucide-react"
import { ButtonHTMLAttributes, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import useVaults from "~/hooks/use-vaults"
import { Vault } from "~/lib/backend-types"
import { CreateVaultForm } from "./create-vault-form"
import { cn } from "@repo/ui/lib/utils"

// Duplicate logic with settings and open folder dialog
const manageVaultsDialogOpenAtom = atom(false)
const useManageVaultsDialogOpen = () => {
  const [open, setOpen] = useAtom(manageVaultsDialogOpenAtom)
  const { disableNavigation, enableNavigation } = useNavigationLock()

  return [
    open,
    (newOpen: boolean) => {
      if (newOpen) {
        disableNavigation()
      } else {
        enableNavigation()
      }
      setOpen(newOpen)
    },
  ] as const
}

export const ManageVaultsDialogTrigger = ({
  className,
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [open, setOpen] = useManageVaultsDialogOpen()
  const toggleOpenManageVaultsShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_OPEN_MANAGE_VAULTS
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn("flex items-center gap-2", className)}
            onClick={() => {
              setOpen(!open)
            }}
          >
            <GalleryVerticalEnd /> Manage vaults
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Manage your vaults
            <TooltipShortcutKeys shortcut={toggleOpenManageVaultsShortcut} />
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const ManageVaultsDialogShortcut = () => {
  const [open, setOpen] = useManageVaultsDialogOpen()
  const toggleManageVaultsShortcut = useShortcutInfo(
    AVAILABLE_SHORTCUTS.TOGGLE_OPEN_MANAGE_VAULTS
  )

  useHotkeys(
    toggleManageVaultsShortcut?.hotkeys.join(",") ?? "",
    () => {
      setOpen(!open)
    },
    { enabled: toggleManageVaultsShortcut?.enabled ?? false }
  )
  return null
}

export default function ManageVaultsDialog() {
  const [open, setOpen] = useManageVaultsDialogOpen()

  const addNewVaultTab = { id: "add-new-vault", label: "Add new vault" }
  const { vaults, refetchVaults } = useVaults()

  const [currentTab, setCurrentTab] = useState<{
    id: string
    label: string
  }>(
    vaults.length > 0
      ? { id: vaults[0].id, label: vaults[0].name }
      : addNewVaultTab
  )

  const onVaultCreated = async (createdVault: Vault | null) => {
    const refetchedVaults = await refetchVaults()

    // Check if created vault was returned, then just in case check if it is present in the vaults that we have currently
    // to avoid setting a non-existing tab
    if (
      createdVault &&
      refetchedVaults.some((vault) => vault.id === createdVault.id)
    )
      setCurrentTab({ id: createdVault.id, label: createdVault.name })
  }
  // This skip thing is looking long, on skip it scrolls the entire content in dialog, it messes it up
  // const handleSkip = (e: React.MouseEvent | React.KeyboardEvent) => {
  //     e.preventDefault();
  // };

  // Its a dialog instead of navigation aware dialog because it wasn't working properly with it, instead the hook to set the atom manages locking and unlocking note navigation
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Manage vaults</DialogTitle>
          <DialogDescription className="sr-only">
            This is where you can manage your vaults. Add, remove or edit your
            vaults.
          </DialogDescription>
        </DialogHeader>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex border-r">
            <SidebarHeader>
              <h2 className="mb-4 text-2xl font-bold pl-4 pt-4">Vaults</h2>
            </SidebarHeader>
            <SidebarContent className="md:max-h-[360px] md:max-w-[550px] lg:max-w-[600px] ">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* <a
                                            href="#add-new-vault"
                                            className={
                                                "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:p-2 focus:bg-background focus:z-50 focus:border text-xs"
                                            }
                                        >
                                            Skip list
                                        </a> */}
                    {vaults.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.id === currentTab.id}
                        >
                          <Button
                            variant={"ghost"}
                            onClick={() =>
                              setCurrentTab({
                                id: item.id,
                                label: item.name,
                              })
                            }
                          >
                            <span className="w-full">{item.name}</span>
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <Button
                disabled={currentTab.id === addNewVaultTab.id}
                onClick={() => setCurrentTab(addNewVaultTab)}
              >
                <PlusIcon /> Add new vault
              </Button>
            </SidebarFooter>
          </Sidebar>

          <main className="flex h-full  md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                {currentTab.label}
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 ">
              {currentTab.id === addNewVaultTab.id ? (
                <div className="space-y-12">
                  <div className="w-full justify-center flex pt-12">
                    <VaultIcon className="size-20" />
                  </div>
                  <div className="px-10">
                    <CreateVaultForm onSuccess={onVaultCreated} />
                  </div>
                </div>
              ) : (
                <VaultTab
                  vault={vaults.find((vault) => vault.id === currentTab.id)}
                />
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}

const VaultTab = ({ vault }: { vault: Vault | undefined }) => {
  if (!vault) {
    return null
  }

  return (
    <div className="flex flex-col  h-full">
      <div className="pt-2 space-y-8">
        <div className="spacey-y-4">
          <Label htmlFor="edit-vault-name">Vault name</Label>
          <div className="flex flex-col gap-2 pt-2 ">
            <InputWithIcons
              id={"edit-vault-name"}
              className="border border-secondary"
              startIcon={<Pencil className="size-4" />}
              value={vault.name}
            />
            <div className="grid grid-cols-2 gap-3">
              <Button size={"sm"} variant={"secondary"}>
                <XIcon className="size-3 mr-2" />
                Cancel
              </Button>
              <Button size={"sm"}>
                <Save className="size-3 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label>Filepath</Label>
          <div className="pt-1">
            <div className="text-sm text-muted-foreground">
              {vault.filepath}
            </div>
            <div className="pt-1">
              <Button size={"sm"} className="w-full" variant={"outline"}>
                <ArchiveIcon className="size-4 mr-2" />
                <span>Reveal in file explorer</span>
              </Button>
            </div>
          </div>
        </div>

        <Collapsible>
          <CollapsibleTrigger
            className=" w-fit text-destructive text-left flex items-center gap-2"
            onClick={() => console.log("col")}
          >
            <Label className="text-destructive">Destructive</Label>
            <ChevronDown className="size-3" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <Button variant={"destructive"} size={"sm"} className="w-full">
              <Trash2 className="mr-2 size-4" /> Remove vault
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="flex items-end h-full ">
        <div className="flex items-center justify-between w-full">
          <Button variant={"secondary"} className="group">
            Open by adding
            <ArrowRight className="ml-2 group-hover:scale-100 group-focus:scale-100 group-focus:size-4 group-hover:size-4 scale-0 transition-all size-0" />
          </Button>
          <Button variant={"secondary"} className="group">
            Open by replacing
            <ArrowRight className="ml-2 group-hover:scale-100 group-focus:scale-100 group-focus:size-4 group-hover:size-4 scale-0 transition-all size-0" />
          </Button>
        </div>
      </div>
    </div>
  )
}
