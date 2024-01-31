import { z } from "zod";

const createSchema = z.object({
  name: z.string(),
})

const updateSchema = z.object({
  name: z.string().optional(),
})

const categoryValidator = { createSchema, updateSchema }
export default categoryValidator