import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { Order } from '@/orders/entities/order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMapperProvider {
  /**
   * Map Order antity sang OrderDto
   */
  toOrderDto(order: Order): OrderDto {
    return {
      id: order.id,
      order_date: order.order_date,
      status: order.status,
      total_amount: order.total_amount,
    };
  }

  /**
   * Mapp array Order antity sang OrderDto array
   */
  toOrderDtos(orders: Order[]): OrderDto[] {
    return orders.map((order) => this.toOrderDto(order));
  }

  /**
   * Map Order antity sang OrderDetailDto với tất cả ralationships
   */
  toOrderDetailDto(order: Order): OrderDetailDto {
    return {
      id: order.id,
      user: {
        id: order.user_id,
        email: order.user.email,
        username: order.user.username,
        phone_number: order.user.phone_number,
      },
      shipping_address: order.shipping_address,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      items: order.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image_url: item.product.image_url || '',
        },
      })),
      order_date: order.order_date,
      status: order.status,
      total_amount: Number(order.total_amount),
    };
  }

  /**
   * Mapper: Order Entity -> OrderDto
   */
  mapOrderToDto(order: Order): OrderDto {
    return {
      id: order.id,
      order_date: order.order_date,
      status: order.status,
      total_amount: Number(order.total_amount),
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
      order_date: order.order_date,
      status: order.status,
      payment_status: order.payment_status,
      total_amount: Number(order.total_amount),
      shipping_address: order.shipping_address,
      payment_method: order.payment_method,
      note: order.note,
      items:
        order.items?.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            image_url: item.product.image_url || '',
          },
          quantity: item.quantity,
          price_at_purchase: Number(item.price_at_purchase),
        })) || [],
    };
  }
}
