import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RefreshCw } from 'lucide-react';

export interface ProductsFiltersProps {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearch: () => void;
    onRefresh: () => void;
    isLoading?: boolean;
}

/**
 * Search và filter component cho products
 * Hỗ trợ tìm kiếm theo tên sản phẩm, Enter key, loading states
 */
export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    onRefresh,
    isLoading = false
}) => {
    /**
     * Handle Enter key để search nhanh
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tìm Kiếm & Lọc</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm theo tên sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => onSearchQueryChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={onSearch}
                            variant="outline"
                            disabled={isLoading}
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Tìm Kiếm
                        </Button>
                        <Button
                            onClick={onRefresh}
                            variant="outline"
                            disabled={isLoading}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm Mới
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 