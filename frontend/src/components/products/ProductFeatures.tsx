import { Truck, Shield, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from "@/types";

interface ProductFeaturesProps {
    readonly product: Product;
}

export function ProductFeatures({ product }: ProductFeaturesProps) {
    return (
        <>
            {/* Features */}
            <div className="grid grid-cols-1 mb-12 md:grid-cols-3 gap-6 ">
                <Card>
                    <CardContent className="flex items-center space-x-3 p-6">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Miễn phí vận chuyển</h4>
                            <p className="text-sm text-gray-600">Cho đơn hàng trên 500.000đ</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center space-x-3 p-6">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Bảo hành chính hãng</h4>
                            <p className="text-sm text-gray-600">12 tháng toàn quốc</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center space-x-3 p-6">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Đổi trả 7 ngày</h4>
                            <p className="text-sm text-gray-600">Miễn phí đổi trả</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Product Specifications */}
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã sản phẩm:</span>
                                <span className="font-medium">{product.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Danh mục:</span>
                                <span className="font-medium">{product.category.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tình trạng:</span>
                                <span className="font-medium">
                                    {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ngày tạo:</span>
                                <span className="font-medium">
                                    {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cập nhật:</span>
                                <span className="font-medium">
                                    {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
} 