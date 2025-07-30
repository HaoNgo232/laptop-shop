import { OrderStatusEnum } from "@/types";
import { Badge } from "@/components/ui/badge";


export const getStatusBadge = (status: OrderStatusEnum) => {
    switch (status) {
        case OrderStatusEnum.DELIVERED:
            return <Badge className="bg-green-100 text-green-800">Khách đã nhận hàng</Badge>;
        case OrderStatusEnum.PENDING:
            return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
        case OrderStatusEnum.PROCESSING:
            return <Badge className="bg-blue-100 text-blue-800">Đang chuẩn bị hàng</Badge>;
        case OrderStatusEnum.SHIPPED:
            return <Badge className="bg-purple-100 text-purple-800">Đã giao cho vận chuyển</Badge>;
        case OrderStatusEnum.CANCELLED:
            return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};