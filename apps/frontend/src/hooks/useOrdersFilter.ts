import { useState, useEffect, useMemo } from "react";
import { useAdminOrderStore } from "@/stores/admin/adminOrderStore";
import { Order } from "@/types/order";
import { AdminOrderQuery } from "@/types/admin";
import { OrderStatusEnum } from "@web-ecom/shared-types/orders/enums";

export function useOrdersFilter() {
  const { orders, fetchOrders, isLoading, error } = useAdminOrderStore();

  // Local state for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusEnum | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch ALL orders only once on mount - tối ưu server calls
  useEffect(() => {
    const query: AdminOrderQuery = {
      page: 1,
      limit: 1000, // Lấy nhiều orders để có đủ data cho client-side filtering
    };
    fetchOrders(query);
  }, [fetchOrders]);

  // Auto-refresh orders every 90 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const query: AdminOrderQuery = {
        page: 1,
        limit: 1000,
      };
      fetchOrders(query);
    }, 90000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Client-side filtering và search - tuân thủ Pure Function principle
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter theo status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Search theo ID hoặc email
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          (order as any).user?.email?.toLowerCase().includes(searchLower) ||
          (order as any).user?.username?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [orders, statusFilter, searchTerm]);

  // Pagination cho filtered results
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Stats calculation từ TẤT CẢ orders (không bị ảnh hưởng bởi filter)
  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter(
        (order) => order.status === OrderStatusEnum.PENDING,
      ).length,
      processing: orders.filter(
        (order) => order.status === OrderStatusEnum.PROCESSING,
      ).length,
      shipped: orders.filter(
        (order) => order.status === OrderStatusEnum.SHIPPED,
      ).length,
      delivered: orders.filter(
        (order) => order.status === OrderStatusEnum.DELIVERED,
      ).length,
      cancelled: orders.filter(
        (order) => order.status === OrderStatusEnum.CANCELLED,
      ).length,
    }),
    [orders],
  );

  // Reset currentPage khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Actions
  const handleFilterByStatus = (status: OrderStatusEnum) => {
    setStatusFilter(status);
    setSearchTerm(""); // Clear search term để focus vào status filter

    // Scroll đến phần danh sách đơn hàng
    setTimeout(() => {
      const ordersSection = document.getElementById("orders-list-section");
      if (ordersSection) {
        ordersSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleClearFilter = () => {
    setStatusFilter("all");
    setSearchTerm("");
  };

  const handleRefresh = () => {
    const query: AdminOrderQuery = {
      page: 1,
      limit: 1000,
    };
    fetchOrders(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Data
    orders: paginatedOrders,
    allOrders: orders,
    filteredOrders,
    stats,
    isLoading,
    error,

    // Filter state
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,

    // Actions
    setSearchTerm,
    setStatusFilter,
    handleFilterByStatus,
    handleClearFilter,
    handleRefresh,
    handlePageChange,
  };
}
