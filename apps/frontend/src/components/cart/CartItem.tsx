import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CartItem } from '@/types/cart';

interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
    onRemoveItem: (productId: string) => Promise<void>;
}

export function CartItemComponent({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    // Format giá tiền
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Tính total cho item này
    const itemTotal = item.quantity * item.priceAtAddition;

    // Tăng số lượng
    const handleIncrease = async () => {
        try {
            setIsUpdating(true);
            await onUpdateQuantity(item.product.id, item.quantity + 1);
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Giảm số lượng
    const handleDecrease = async () => {
        if (item.quantity <= 1) return; // Không cho giảm xuống dưới 1

        try {
            setIsUpdating(true);
            await onUpdateQuantity(item.product.id, item.quantity - 1);
        } catch (error) {
            console.error('Failed to decrease quantity:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Xóa sản phẩm
    const handleRemove = async () => {
        try {
            setIsUpdating(true);
            await onRemoveItem(item.product.id);
        } catch (error) {
            console.error('Failed to remove item:', error);
            setIsUpdating(false); // Reset nếu lỗi
        }
        // Không cần reset isUpdating nếu thành công vì component sẽ unmount
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                    {/* Hình ảnh sản phẩm */}
                    <div className="flex-shrink-0">
                        <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                            {item.product.category.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {formatPrice(item.priceAtAddition)} / sản phẩm
                        </p>
                    </div>

                    {/* Điều khiển số lượng */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDecrease}
                            disabled={isUpdating || item.quantity <= 1}
                            className="h-8 w-8 p-0"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>

                        <span className="text-lg font-medium min-w-[2rem] text-center">
                            {item.quantity}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleIncrease}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Tổng giá */}
                    <div className="text-right min-w-[100px]">
                        <p className="text-lg font-bold text-primary">
                            {formatPrice(itemTotal)}
                        </p>
                    </div>

                    {/* Nút xóa */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 