import { SortOrder } from "@web-ecom/shared-types/products/enums";
import { z } from "zod";
import type {
  ICategory,
  ICategoryBrief,
  IProduct,
  IProductDetail,
  ICreateProduct,
  IUpdateProduct,
  ICreateCategory,
  IUpdateCategory,
  IQueryProduct,
  IProductListResponse,
  ICategoryListResponse,
} from "@web-ecom/shared-types/products/interfaces";

export type ProductDetail = z.infer<typeof ProductDetailSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoryBrief = z.infer<typeof CategoryBriefSchema>;
export type CreateProduct = z.infer<typeof CreateProductDtoSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductDtoSchema>;
export type CreateCategory = z.infer<typeof CreateCategoryDtoSchema>;
export type UpdateCategory = z.infer<typeof UpdateCategoryDtoSchema>;
export type QueryProduct = z.infer<typeof QueryProductDtoSchema>;

// Response types
export interface ProductListResponse extends IProductListResponse {}
export interface CategoryListResponse extends ICategoryListResponse {}

// Zod Validation Schemas
const CategorySchema: z.ZodType<ICategory> = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const CategoryBriefSchema: z.ZodType<ICategoryBrief> = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const ProductSchema: z.ZodType<IProduct> = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string(),
  price: z.number().positive("Giá sản phẩm phải lớn hơn 0"),
  stock_quantity: z.number().int().min(0, "Số lượng tồn kho không được âm"),
  image_url: z.string().url("URL hình ảnh không hợp lệ"),
  category: CategoryBriefSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ProductDetailSchema: z.ZodType<IProductDetail> = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string(),
  price: z.number().positive("Giá sản phẩm phải lớn hơn 0"),
  stock_quantity: z.number().int().min(0, "Số lượng tồn kho không được âm"),
  image_url: z.string().url("URL hình ảnh không hợp lệ"),
  category: CategorySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateProductDtoSchema: z.ZodType<ICreateProduct> = z.object({
  name: z
    .string()
    .min(1, "Tên sản phẩm là bắt buộc")
    .max(255, "Tên sản phẩm quá dài"),
  description: z.string().min(1, "Mô tả sản phẩm là bắt buộc"),
  price: z.number().positive("Giá sản phẩm phải lớn hơn 0"),
  stock_quantity: z.number().int().min(0, "Số lượng tồn kho không được âm"),
  image_url: z.string().url("URL hình ảnh không hợp lệ"),
  category_id: z.string().uuid("Category ID không hợp lệ"),
});

const UpdateProductDtoSchema: z.ZodType<IUpdateProduct> = z.object({
  name: z
    .string()
    .min(1, "Tên sản phẩm là bắt buộc")
    .max(255, "Tên sản phẩm quá dài")
    .optional(),
  description: z.string().min(1, "Mô tả sản phẩm là bắt buộc").optional(),
  price: z.number().positive("Giá sản phẩm phải lớn hơn 0").optional(),
  stock_quantity: z
    .number()
    .int()
    .min(0, "Số lượng tồn kho không được âm")
    .optional(),
  image_url: z.string().url("URL hình ảnh không hợp lệ").optional(),
  category_id: z.string().uuid("Category ID không hợp lệ").optional(),
  active: z.boolean().optional(),
});

const CreateCategoryDtoSchema: z.ZodType<ICreateCategory> = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục là bắt buộc")
    .max(100, "Tên danh mục quá dài"),
  description: z.string().optional(),
});

const UpdateCategoryDtoSchema: z.ZodType<IUpdateCategory> = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục là bắt buộc")
    .max(100, "Tên danh mục quá dài")
    .optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

const QueryProductDtoSchema: z.ZodType<IQueryProduct> = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  category_id: z.string().uuid().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  search: z.string().optional(),
});
