import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/SearchBar';
import { ProductList } from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOrder } from '@/enums/product';
import { useProductStore } from '@/stores/productStore';

export function ProductsPage() {
    const [searchParams] = useSearchParams();
    const {
        products,
        categories,
        isLoading: productsLoading,
        error: productsError,
        fetchProducts,
        fetchCategories,
        searchProducts,
        clearError
    } = useProductStore();

    const [currentCategory, setCurrentCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

    // Load data khi component mount
    useEffect(() => {
        fetchCategories();

        // Check URL params for category filter
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setCurrentCategory(categoryParam);
            fetchProducts({
                category_id: categoryParam,
                sortBy,
                sortOrder
            });
        } else {
            fetchProducts();
        }
    }, [searchParams]);

    // Handle search
    const handleSearch = async (searchTerm: string) => {
        if (searchTerm.trim()) {
            await searchProducts(searchTerm, {
                category_id: currentCategory === 'all' ? undefined : currentCategory,
                sortBy,
                sortOrder
            });
        } else {
            await fetchProducts({
                category_id: currentCategory === 'all' ? undefined : currentCategory,
                sortBy,
                sortOrder
            });
        }
    };

    // Handle category filter
    const handleCategoryChange = async (categoryId: string) => {
        setCurrentCategory(categoryId);
        await fetchProducts({
            category_id: categoryId === 'all' ? undefined : categoryId,
            sortBy,
            sortOrder
        });
    };

    // Handle sort change
    const handleSortChange = async (newSortBy: string) => {
        setSortBy(newSortBy);
        await fetchProducts({
            category_id: currentCategory === 'all' ? undefined : currentCategory,
            sortBy: newSortBy,
            sortOrder
        });
    };

    // Handle sort order change
    const handleSortOrderChange = async (newSortOrder: SortOrder) => {
        setSortOrder(newSortOrder);
        await fetchProducts({
            category_id: currentCategory === 'all' ? undefined : currentCategory,
            sortBy,
            sortOrder: newSortOrder
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm</h1>
                        <p className="text-gray-600">
                            Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi
                        </p>
                    </div>

                    {/* Search và Filters */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <Select value={currentCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort */}
                        <div className="flex space-x-2">
                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Mới nhất</SelectItem>
                                    <SelectItem value="name">Tên A-Z</SelectItem>
                                    <SelectItem value="price">Giá</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SortOrder.ASC}>↑</SelectItem>
                                    <SelectItem value={SortOrder.DESC}>↓</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {currentCategory === 'all'
                                ? `Tất cả sản phẩm (${products.length} sản phẩm)`
                                : `${categories.find(c => c.id === currentCategory)?.name || 'Danh mục'} (${products.length} sản phẩm)`
                            }
                        </h2>
                        {productsError && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    clearError();
                                    fetchProducts();
                                }}
                            >
                                Thử lại
                            </Button>
                        )}
                    </div>

                    {/* Error State */}
                    {productsError && (
                        <Card className="max-w-2xl mx-auto mb-8">
                            <CardContent className="text-center py-6">
                                <p className="text-red-600 mb-4">{productsError}</p>
                                <Button onClick={() => {
                                    clearError();
                                    fetchProducts();
                                }}>
                                    Thử lại
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Products Grid */}
                    {!productsError && (
                        <ProductList
                            products={products}
                            isLoading={productsLoading}
                        />
                    )}

                    {/* Empty State */}
                    {!productsLoading && !productsError && products.length === 0 && (
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle>Không tìm thấy sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
                                </p>
                                <Button onClick={() => {
                                    setCurrentCategory('all');
                                    fetchProducts();
                                }}>
                                    Xem tất cả sản phẩm
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
} 