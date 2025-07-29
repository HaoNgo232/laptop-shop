import { PaymentStatusEnum } from "@web-ecom/shared-types";
import { CheckCircle, Clock, XCircle } from "lucide-react";


export const getPaymentStatusIcon = (status: PaymentStatusEnum) => {
    switch (status) {
        case PaymentStatusEnum.PAID:
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case PaymentStatusEnum.PENDING:
        case PaymentStatusEnum.WAITING:
            return <Clock className="h-4 w-4 text-yellow-600" />;
        case PaymentStatusEnum.FAILED:
        case PaymentStatusEnum.CANCELLED:
            return <XCircle className="h-4 w-4 text-red-600" />;
        default:
            return <Clock className="h-4 w-4 text-gray-600" />;
    }
};