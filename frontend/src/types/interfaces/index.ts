/**
 * Centralized interface exports
 * Tập trung export tất cả interfaces - theo Interface Segregation Principle
 */

// Auth interfaces
export type {
  User,
  UserRankInfo,
  DiscountInfo,
  LoginUser,
  RegisterUser,
  UpdateProfile,
  RefreshToken,
  ForgotPassword,
  ResetPasswordPayload,
  ResetPassword,
  ChangePassword,
  LoginResponse,
  JwtPayload,
  UserProfile,
} from "./auth";

// Common interfaces
export type {
  ApiResponse,
  ApiResponseWithMessage,
  PaginationMeta,
  PaginatedResponse,
  PaginatedResponseWithMessage,
  ApiError,
} from "./common";

// Product interfaces
export type {
  Category,
  CategoryBrief,
  CategoryDetail,
  Product,
  ProductBrief,
  ProductDetail,
  CreateProduct,
  UpdateProduct,
  CreateCategory,
  UpdateCategory,
  QueryProduct,
  ProductListResponse,
  CategoryListResponse,
} from "./products";

// Cart interfaces
export type {
  CartItem,
  Cart,
  AddToCart,
  UpdateCartItem,
  CartResponse,
  CartSummary,
} from "./cart";

// Order interfaces
export type {
  OrderItem,
  Order,
  OrderDetail,
  CreateOrderRequest,
  QRCodeResponse,
  CreateOrderResponse,
  ShippingAddress,
  ICheckoutState,
  OrderListResponse,
  OrderListResponseWithMessage,
  AdminOrderQuery,
  UpdateOrderStatus,
} from "./orders";

// Admin interfaces
export type {
  AdminView,
  AdminDetail,
  UpdateByAdmin,
  AdminQuery,
  DashboardSummary,
  OrdersByStatus,
  RevenueByMonth,
  DetailedStats,
} from "./admin";

// Review interfaces
export type {
  Review,
  UserBrief,
  ReviewWithUser,
  CreateReview,
  UpdateReview,
  ReviewQuery,
  AdminReviewQuery,
  ReviewListResponse,
  ReviewEntityFields,
  CreateReviewFields,
  UpdateReviewFields,
} from "./reviews";
