import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';

// Import các use cases
import { ValidateCartUseCase } from './validate-cart.usecase';
import { ValidateStockAndCalculateTotalUseCase } from './validate-stock-and-calculate-total.usecase';
import { CreateOrderTransactionUseCase } from './create-order-transaction.usecase';
import { GeneratePaymentQrUseCase } from './generate-payment-qr.usecase';

export interface CreateOrderResult {
  order: OrderDto;
  qrCode?: QRCodeResponse;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly validateCartUseCase: ValidateCartUseCase,
    private readonly validateStockAndCalculateTotalUseCase: ValidateStockAndCalculateTotalUseCase,
    private readonly createOrderTransactionUseCase: CreateOrderTransactionUseCase,
    private readonly generatePaymentQrUseCase: GeneratePaymentQrUseCase,
    private readonly orderMapperProvider: OrderMapperProvider,
  ) {}

  /**
   * Main orchestrator cho order creation
   * Tuân thủ Single Responsibility Principle - chỉ orchestrate, không implement chi tiết
   * Tuân thủ Dependency Inversion Principle - depend on abstractions (use cases)
   */
  async execute(userId: string, createOrderDto: CreateOrderDto): Promise<CreateOrderResult> {
    // 1. Validate cart
    const cart = await this.validateCartUseCase.execute(userId);

    // 2. Validate stock và calculate total
    const { orderItems, totalAmount } = await this.validateStockAndCalculateTotalUseCase.execute(
      cart.cartItems,
    );

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
