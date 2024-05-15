import { z } from "zod";

const MIN_LEN = 2;
const MAX_LEN = 20;

export const createVaultSchema = z.object({
  name: z
    .string()
    .min(MIN_LEN, {
      message: `Name must be at least ${MIN_LEN} characters.`,
    })
    .max(20, { message: `Name must be less that ${MAX_LEN} characters.` }),
  location: z.string(),
});

export type createVaultSchemaType = z.infer<typeof createVaultSchema>;
