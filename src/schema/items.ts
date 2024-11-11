import {z} from "zod"

export const itemSchema = z.object({
    shortDescription: z.string().trim().min(1),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const purchaseSchema = z.object({
    retailer: z.string().min(1),
    purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    purchaseTime: z.string().regex(/^\d{2}:\d{2}$/),
    items: z.array(itemSchema).nonempty(),
    total: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export type Purchase = z.infer<typeof purchaseSchema>;
