/* eslint-disable prefer-const */
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    isLoading = false
}: PaginationProps) {
    // Tính toán hiển thị thông tin
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Tạo array các trang để hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Nếu tổng số trang ít, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Logic hiển thị pagination thông minh
            const half = Math.floor(maxVisiblePages / 2);
            let start = Math.max(currentPage - half, 1);
            let end = Math.min(start + maxVisiblePages - 1, totalPages);

            if (end - start + 1 < maxVisiblePages) {
                start = Math.max(end - maxVisiblePages + 1, 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    if (totalPages <= 1) {
        return null; // Không hiển thị pagination nếu chỉ có 1 trang
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {/* Thông tin trang */}
            <div className="text-sm text-gray-600">
                Hiển thị {startItem} - {endItem} trong {totalItems} sản phẩm
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Nút Previous */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Trước</span>
                </Button>

                {/* Số trang */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className="min-w-[36px]"
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                {/* Nút Next */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}