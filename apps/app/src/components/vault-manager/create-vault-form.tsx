import { zodResolver } from "@hookform/resolvers/zod"
import { ArchiveIcon } from "@radix-ui/react-icons"
import { Button } from "@repo/ui/components/ui/button"
import { open } from "@tauri-apps/api/dialog"

import { Input } from "@repo/ui/components/ui/input"
import { useForm } from "react-hook-form"

import { addVault } from "~/lib/services/vault-service.ts"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"

import { PlusIcon } from "lucide-react"
import useVaults from "~/hooks/use-vaults"
import { Vault } from "~/lib/backend-types.ts"
import {
  createVaultSchema,
  createVaultSchemaType,
} from "~/components/vault-manager/schemas.ts"

export const CreateVaultForm = ({
  onSuccess,
}: {
  onSuccess?: (vault: Vault | null) => void
}) => {
  const { vaults } = useVaults()

  const form = useForm<createVaultSchemaType>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  })

  async function onSubmit(values: createVaultSchemaType) {
    const result = await addVault(values.name, values.location)

    if (result.error) {
      form.setError("location", {
        message:
          "You already have a vault in this location." +
          (" Vault: " +
            (vaults.find((vault) => vault.filepath === values.location)?.name ??
              "")),
      })
      return
    }

    onSuccess?.(result.data)
    form.reset()
  }

  const onBrowse = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      recursive: true,
    })
    if (typeof selected != "string") {
      return
    }

    form.setValue("location", selected)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <FormLabel>Vault name</FormLabel>
                  <FormDescription>Pick a name for your vault.</FormDescription>
                </div>
                <FormControl>
                  <Input
                    placeholder="name"
                    {...field}
                    className="w-[12rem] border-secondary"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={() => (
            <FormItem>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <FormLabel>Location</FormLabel>
                  <FormDescription className="flex flex-col">
                    <span>
                      {location != null
                        ? "Your new vault location will be placed in."
                        : "Pick a folder to put your new vault."}
                    </span>
                    {location && (
                      <span className="text-sm text-primary max-w-[15rem] overflow-x-auto">
                        {form.getValues("location")}
                      </span>
                    )}
                  </FormDescription>
                </div>

                <FormControl>
                  <Button
                    type="button"
                    className="w-fit"
                    variant={"secondary"}
                    id={"select-location-button"}
                    onClick={onBrowse}
                  >
                    <ArchiveIcon className="mr-2 size-3" />
                    Browse
                  </Button>
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit mt-2" type="submit">
          <PlusIcon className="mr-2 size-4" />
          Create
        </Button>
      </form>
    </Form>
  )
}
