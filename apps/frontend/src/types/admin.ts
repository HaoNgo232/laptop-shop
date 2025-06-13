import type {
  IDashboardSummary,
  IDetailedStats,
  IAdminView,
  IAdminDetail,
  IUpdateByAdmin,
  IAdminQuery,
} from "@web-ecom/shared-types/admin/interfaces";

export interface DashboardSummary extends IDashboardSummary {}

export interface DetailedStats extends IDetailedStats {}

export interface AdminView extends IAdminView {}

export interface AdminDetail extends IAdminDetail {}

export interface UpdateByAdmin extends IUpdateByAdmin {}

export interface AdminQuery extends IAdminQuery {}
