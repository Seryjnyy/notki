import { useForm } from "react-hook-form"
import {
  editVaultSchema,
  editVaultSchemaType,
} from "~/components/vault-manager/schemas.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { Vault } from "~/lib/backend-types.ts"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form.tsx"
import { InputWithIcons } from "@repo/ui/components/ui/input-with-icons"
import { Pencil, Save, XIcon } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { editVaultName } from "~/lib/services/vault-service.ts"

interface EditVaultFormProps {
  vault: Vault
  onSuccess?: (vault: Vault | undefined) => void
}

const EditVaultForm = ({ vault, onSuccess }: EditVaultFormProps) => {
  const form = useForm<editVaultSchemaType>({
    resolver: zodResolver(editVaultSchema),
    defaultValues: {
      name: vault.name,
    },
  })

  async function onSubmit(values: editVaultSchemaType) {
    // TODO : Backend returns the whole config file, yh not ideal, but not planning to rework that currently at least for a
    // while.
    const config = await editVaultName(vault.id, values.name)
    onSuccess?.(config.vaults.find((item) => item.id === vault.id))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2 pt-2 ">
                <div className="flex flex-col">
                  <FormLabel>Vault name</FormLabel>
                  <FormDescription className={"sr-only"}>
                    Pick a name for your vault.
                  </FormDescription>
                </div>
                <FormControl>
                  <InputWithIcons
                    placeholder="name"
                    className="border border-secondary"
                    startIcon={<Pencil className="size-4" />}
                    {...field}
                  />
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues("name") !== vault.name && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              size={"sm"}
              variant={"secondary"}
              type={"reset"}
              onClick={() => form.reset()}
            >
              <XIcon className="size-3 mr-2" />
              Cancel
            </Button>
            <Button size={"sm"} type={"submit"}>
              <Save className="size-3 mr-2" />
              Save
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}

export default EditVaultForm
