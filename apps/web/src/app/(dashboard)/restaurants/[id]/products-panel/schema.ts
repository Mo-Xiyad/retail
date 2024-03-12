import { z } from 'zod';

export const productsSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_deal: z.boolean(),
  price: z.number(),
  category: z.array(z.string())
});

export type Product = z.infer<typeof productsSchema>;
