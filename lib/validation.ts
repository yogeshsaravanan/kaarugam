import { z } from "zod";

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "invalid colour");

export const designSchema = z.object({
  base: hex, border: hex, pallu: hex,
  pattern: z.enum(["plain", "temple", "check"]),
  text: z.string().max(16).optional(),
  textColor: hex.optional(),
}).partial({ text: true, textColor: true });

export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    qty: z.number().int().min(1).max(10),
    design: designSchema.nullish(),
  })).min(1),
  customer: z.object({
    name: z.string().max(120).optional(),
    phone: z.string().max(20).optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().max(500).optional(),
  }).default({}),
  method: z.enum(["online", "cod"]).default("online"),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().max(40).optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(800),
});

export const productUpsertSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  category: z.enum(["Traditional", "Modern", "Marriage", "Casual & Others"]),
  price: z.number().int().min(0),      // paise
  base: hex, border: hex, pallu: hex,
  pattern: z.enum(["plain", "temple", "check"]),
  blurb: z.string().max(600),
  stock: z.number().int().min(0),
  active: z.boolean().default(true),
  imagePath: z.string().max(300).nullish(),
});
