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
  PlusIcon,
  Trash2,
  VaultIcon,
} from "lucide-react"
import React, {
  ButtonHTMLAttributes,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import useVaults from "~/hooks/use-vaults"
import { Vault } from "~/lib/backend-types"
import { CreateVaultForm } from "./create-vault-form"
import { cn } from "@repo/ui/lib/utils"
import { removeVault } from "~/lib/services/vault-service.ts"
import { showInFileExplorer } from "~/lib/services/directory-service.ts"
import EditVaultForm from "~/components/vault-manager/edit-vault-form.tsx"
import { useUploadNotesFromVaults } from "~/hooks/use-upload-notes-from-vaults"

// TODO : Fast refresh only works when a file only exports components. react-refresh/only-export-components

const openInVaultManagerAtom = atom({ id: "", label: "" })

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

export const useOpenVaultInManager = (vault: Vault) => {
  const [, setOpen] = useManageVaultsDialogOpen()
  const [, setTarget] = useAtom(openInVaultManagerAtom)

  return () => {
    setOpen(true)
    setTarget({ id: vault.id, label: vault.name })
  }
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
        <TooltipContent side={"right"}>
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

// TODO : When vault is first opened here, but then removed some where else then the "target" here doesn't get updated
//  so the old tab name remains and its a blank page.
export default function ManageVaultsDialog() {
  const [open, setOpen] = useManageVaultsDialogOpen()
  const addNewVaultButtonRef = useRef<HTMLButtonElement>(null)
  const vaultTabRef = useRef<HTMLDivElement>(null)

  const addNewVaultTab = useMemo(
    () => ({ id: "add-new-vault", label: "Add new vault" }),
    []
  )
  const { vaults, refetchVaults } = useVaults()
  const [target, setTarget] = useAtom(openInVaultManagerAtom)

  useEffect(() => {
    if (target.id === "" && target.label == "") {
      setTarget(addNewVaultTab)
    }
  }, [target, setTarget, addNewVaultTab])

  const onVaultCreated = async (createdVault: Vault | null) => {
    const refetchedVaults = await refetchVaults()

    // Check if created vault was returned, then just in case check if it is present in the vaults that we have currently
    // to avoid setting a non-existing tab
    if (
      createdVault &&
      refetchedVaults.some((vault) => vault.id === createdVault.id)
    )
      setTarget({ id: createdVault.id, label: createdVault.name })
  }

  const onVaultRemoved = async (vault: Vault) => {
    await refetchVaults()

    console.log("Vault", vault.name, "at", vault.filepath, "was removed.")

    setTarget({ id: "", label: "" })
  }

  const onVaultOpened = () => {
    setOpen(false)
  }
  // This skip thing is looking long, on skip it scrolls the entire content in dialog, it messes it up
  const handleSkip = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    addNewVaultButtonRef.current?.focus({ preventScroll: true })
  }

  const handleChangeTab = (vault: Vault) => {
    if (target.id !== vault.id) {
      setTarget({
        id: vault.id,
        label: vault.name,
      })
    }

    vaultTabRef.current?.focus()
  }

  const currentVault = useMemo(
    () => vaults.find((vault) => vault.id === target.id),
    [target, vaults]
  )

  // When vault name gets updated make sure to update the current tab label
  const onVaultUpdated = (vault: Vault) => {
    if (target.id === vault.id) {
      setTarget({ id: vault.id, label: vault.name })
    }
  }

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
              <Button
                className={
                  "sr-only focus:not-sr-only focus:absolute focus:top-[3.7rem] focus:left-4 z-50 text-muted-foreground text-xs"
                }
                size={"lg"}
                variant={"outline"}
                onClick={handleSkip}
              >
                Skip list
              </Button>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {vaults.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.id === target.id}
                        >
                          <Button
                            variant={"ghost"}
                            onClick={() => handleChangeTab(item)}
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
                disabled={target.id === addNewVaultTab.id}
                onClick={() => setTarget(addNewVaultTab)}
                ref={addNewVaultButtonRef}
              >
                <PlusIcon /> Add new vault
              </Button>
            </SidebarFooter>
          </Sidebar>

          <main className="flex h-full  md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">{target.label}</div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 ">
              {target.id === addNewVaultTab.id ? (
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
                  onOpenVault={onVaultOpened}
                  onRemoveVault={onVaultRemoved}
                  onVaultUpdated={onVaultUpdated}
                  vault={currentVault}
                  ref={vaultTabRef}
                  key={currentVault?.id}
                />
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}

interface VaultTabProps {
  vault: Vault | undefined
  onRemoveVault: (vault: Vault) => void
  onOpenVault: () => void
  onVaultUpdated: (vault: Vault) => void
}

// TODO : When vault is removed by outside source the tab doesn't update and stays on a empty tab

// TODO : when the tab is opened it should focus on the tab so that user can skip the navigation list
// but it doesn't work properly currently, it worked before adding the edit vault form.
const VaultTab = forwardRef<HTMLDivElement, VaultTabProps>(
  ({ vault, onRemoveVault, onOpenVault, onVaultUpdated }, ref) => {
    const uploadNotesFromVaults = useUploadNotesFromVaults()
    const divRef = useRef<HTMLDivElement>()

    useEffect(() => {
      divRef.current?.focus()
    }, [divRef])

    if (!vault) {
      return null
    }

    const handleRemoveVault = async () => {
      onRemoveVault(vault)
      await removeVault(vault.id)
    }

    // TODO : duplicate code with app-sidebar-vaults
    const handleOpenByReplacing = () => {
      uploadNotesFromVaults({
        dirs: [vault.filepath],
        recursive: true,
        replace: true,
      })
      onOpenVault()
    }

    const handleOpenByAdding = () => {
      uploadNotesFromVaults({
        dirs: [vault.filepath],
        recursive: true,
        replace: false,
      })
      onOpenVault()
    }

    const handleRevealInFileExplorer = () => {
      showInFileExplorer(vault.filepath)
    }
    return (
      <div className="flex flex-col  h-full" ref={ref}>
        <div className="pt-2 space-y-8">
          <div className="spacey-y-4">
            <EditVaultForm
              vault={vault}
              onSuccess={(vault) => {
                if (vault) onVaultUpdated?.(vault)
              }}
            />
          </div>

          <div>
            <Label>Filepath</Label>
            <div className="pt-1">
              <div className="text-sm text-muted-foreground">
                {vault.filepath}
              </div>
              <div className="pt-1">
                <Button
                  size={"sm"}
                  className="w-full"
                  variant={"outline"}
                  onClick={handleRevealInFileExplorer}
                >
                  <ArchiveIcon className="size-4 mr-2" />
                  <span>Reveal in file explorer</span>
                </Button>
              </div>
            </div>
          </div>

          <Collapsible>
            <CollapsibleTrigger className=" w-fit text-destructive text-left flex items-center gap-2">
              <Label className="text-destructive">Destructive</Label>
              <ChevronDown className="size-3" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <Button
                variant={"destructive"}
                size={"sm"}
                className="w-full"
                onClick={handleRemoveVault}
              >
                <Trash2 className="mr-2 size-4" /> Remove vault
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="flex items-end h-full ">
          <div className="flex items-center justify-between w-full">
            <Button
              variant={"secondary"}
              className="group"
              onClick={handleOpenByAdding}
            >
              Open by adding
              <ArrowRight className="ml-2 group-hover:scale-100 group-focus:scale-100 group-focus:size-4 group-hover:size-4 scale-0 transition-all size-0" />
            </Button>
            <Button
              variant={"secondary"}
              className="group"
              onClick={handleOpenByReplacing}
            >
              Open by replacing
              <ArrowRight className="ml-2 group-hover:scale-100 group-focus:scale-100 group-focus:size-4 group-hover:size-4 scale-0 transition-all size-0" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
)
