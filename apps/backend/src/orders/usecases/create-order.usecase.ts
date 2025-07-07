import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';

// Import các use cases
import { ValidateStockUseCase } from '@/orders/usecases/validate-stock.usecase';
import { CreateOrderTransactionUseCase } from './create-order-transaction.usecase';
import { GeneratePaymentQrUseCase } from './generate-payment-qr.usecase';
import { CartService } from '@/cart/cart.service';

export interface CreateOrderResult {
  order: OrderDto;
  qrCode?: QRCodeResponse;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly validateStockUseCase: ValidateStockUseCase,
    private readonly createOrderTransactionUseCase: CreateOrderTransactionUseCase,
    private readonly generatePaymentQrUseCase: GeneratePaymentQrUseCase,
    private readonly orderMapperProvider: OrderMapperProvider,
    private readonly cartService: CartService,
  ) {}

  /**
   * Main orchestrator cho order creation
   */
  async execute(userId: string, createOrderDto: CreateOrderDto): Promise<CreateOrderResult> {
    // 1. Tìm cart của user
    const cart = await this.cartService.findOneEntity(userId);

    // 2. Validate stock và calculate total
    const { orderItems, totalAmount } = await this.validateStockUseCase.execute(cart.cartItems);

    // 3. Create order in transaction
    const order = await this.createOrderTransactionUseCase.execute({
      userId,
      createOrderDto,
      orderItems,
      totalAmount,
    });

    // 4. Generate QR code if needed
    const qrCode = await this.generatePaymentQrUseCase.execute(order, createOrderDto.paymentMethod);

    // 5. Map and return result
    return {
      order: this.orderMapperProvider.mapOrderToDto(order),
      qrCode,
    };
  }
}
