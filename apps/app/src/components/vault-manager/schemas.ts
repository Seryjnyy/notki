import { z } from "zod"

export const createVaultSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: `Name must be at least ${1} characters.`,
    })
    .max(30, { message: `Name must be less than ${30} characters.` }),
  location: z
    .string()
    .min(1, { message: "Location must be at least 1 character." }),
})

export type createVaultSchemaType = z.infer<typeof createVaultSchema>

export const editVaultSchema = createVaultSchema.pick({ name: true })

export type editVaultSchemaType = z.infer<typeof editVaultSchema>
