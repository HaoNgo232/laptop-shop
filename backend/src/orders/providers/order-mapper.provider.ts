import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { Order } from '@/orders/entities/order.entity';
import { Injectable } from '@nestjs/common';

interface IOrderMapperProvider {
  toOrderDto(order: Order): OrderDto;
  toOrderDtos(orders: Order[]): OrderDto[];
  toOrderDetailDto(order: Order): OrderDetailDto;
  mapOrderToDto(order: Order): OrderDto;
  mapOrderToDetailDto(order: Order): OrderDetailDto;
}

@Injectable()
export class OrderMapperProvider implements IOrderMapperProvider {
  /**
   * Map Order antity sang OrderDto
   */
  toOrderDto(order: Order): OrderDto {
    return {
      id: order.id,
      orderDate: order.orderDate,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      note: order.note,
      transactionId: order.transactionId,
    };
  }

  /**
   * Mapp array Order antity sang OrderDto array
   */
  toOrderDtos(orders: Order[]): OrderDto[] {
    return orders.map((order) => this.toOrderDto(order));
  }

  /**
   * Map Order antity sang OrderDetailDto với tất cả ralationships
   */
  toOrderDetailDto(order: Order): OrderDetailDto {
    return {
      id: order.id,
      user: {
        id: order.userId,
        email: order.user.email,
        username: order.user.username,
        phoneNumber: order.user.phoneNumber,
      },
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      note: order.note,
      transactionId: order.transactionId,
      items: order.items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          imageUrl: item.product.imageUrl ?? '',
          category: {
            id: item.product.category.id,
            name: item.product.category.name,
          },
        },
        quantity: item.quantity,
        priceAtPurchase: Number(item.priceAtPurchase),
      })),
      orderDate: order.orderDate,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Mapper: Order Entity -> OrderDto
   */
  mapOrderToDto(order: Order): OrderDto {
    return {
      id: order.id,
      orderDate: order.orderDate,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      note: order.note,
      transactionId: order.transactionId,
    };
  }

  /**
   * Mapper: Order Entity -> OrderDetailDto
   */
  mapOrderToDetailDto(order: Order): OrderDetailDto {
    return {
      id: order.id,
      user: {
        id: order.user.id,
        username: order.user.username,
        email: order.user.email,
      },
      orderDate: order.orderDate,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      note: order.note,
      transactionId: order.transactionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items:
        order.items?.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            imageUrl: item.product.imageUrl ?? '',
            category: {
              id: item.product.category.id,
              name: item.product.category.name,
            },
          },
          quantity: item.quantity,
          priceAtPurchase: Number(item.priceAtPurchase),
        })) || [],
    };
  }
}
