import type { ICategoryBrief } from "@web-ecom/shared-types/products/interfaces";
import type {
  ICartItem,
  ICart,
  IAddToCart,
  IUpdateCartItem,
  ICartResponse,
  ICartSummary,
} from "@web-ecom/shared-types/cart/interfaces";
import { z } from "zod";
import { ProductSchema } from "@/types/product";

export type CategoryBrief = z.infer<typeof CategoryBriefSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type AddToCart = z.infer<typeof AddToCartSchema>;
export type UpdateCartItem = z.infer<typeof UpdateCartItemSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;
export type CartSummary = z.infer<typeof CartSummarySchema>;

// Product & Category schemas (cần cho CartItem)
const CategoryBriefSchema: z.ZodType<ICategoryBrief> = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// Zod Validation Schemas
const CartItemSchema: z.ZodType<ICartItem> = z.object({
  id: z.string().uuid(),
  product: ProductSchema,
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
  priceAtAddition: z.number().positive(),
});

const CartSchema: z.ZodType<ICart> = z.object({
  id: z.string().uuid(),
  items: z.array(CartItemSchema),
  totalItems: z.number().int().min(0),
  totalPrice: z.number().min(0),
});

const AddToCartSchema: z.ZodType<IAddToCart> = z.object({
  productId: z.string().uuid("Product ID không hợp lệ"),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
});

const UpdateCartItemSchema: z.ZodType<IUpdateCartItem> = z.object({
  productId: z.string().uuid("Product ID không hợp lệ"),
  quantity: z.number().int().min(0, "Số lượng không được âm"),
});

const CartResponseSchema: z.ZodType<ICartResponse> = z.object({
  data: CartSchema,
  message: z.string().optional(),
});

const CartSummarySchema: z.ZodType<ICartSummary> = z.object({
  totalItems: z.number().int().min(0),
  totalPrice: z.number().min(0),
});
