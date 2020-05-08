import { Expose } from 'class-transformer';
import { ProductDto } from './productDto';
import { UserDto } from './userDto';

export class OrderItemDto {
  @Expose() product: ProductDto;
  @Expose() quantity: number;
}
export class OrderDto {
  @Expose() _id;
  @Expose() date: Date;
  @Expose() user: UserDto;
  @Expose() address: string;
  @Expose() orderItems: OrderItemDto[]
}
