import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusEnum } from '@web-ecom/shared-types/orders/enums';
import { Order } from '@/types/order';

interface OrderStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    newStatus: OrderStatusEnum;
    onStatusChange: (status: OrderStatusEnum) => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function OrderStatusModal({
    isOpen,
    onClose,
    order,
    newStatus,
    onStatusChange,
    onConfirm,
    isLoading
}: OrderStatusModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập Nhật Trạng Thái Đơn Hàng</DialogTitle>
                    <DialogDescription>
                        Thay đổi trạng thái cho đơn hàng #{order?.id.slice(-8)}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Trạng thái mới:</label>
                        <Select value={newStatus} onValueChange={onStatusChange}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={OrderStatusEnum.PENDING}>Chờ xử lý</SelectItem>
                                <SelectItem value={OrderStatusEnum.PROCESSING}>Đang chuẩn bị hàng</SelectItem>
                                <SelectItem value={OrderStatusEnum.SHIPPED}>Đã giao cho vận chuyển</SelectItem>
                                <SelectItem value={OrderStatusEnum.DELIVERED}>Khách đã nhận hàng</SelectItem>
                                <SelectItem value={OrderStatusEnum.CANCELLED}>Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang cập nhật...' : 'Cập Nhật'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 