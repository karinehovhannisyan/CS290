import { ObjectId } from 'mongoose';
import { Expose } from 'class-transformer';

class OrderItemCreationDto {
  @Expose() product: ObjectId;
  @Expose() quantity: number;
}
export class OrderCreationDto {
  @Expose() date: Date;
  @Expose() user: ObjectId;
  @Expose() address: string;
  @Expose() orderItems: [OrderItemCreationDto]
}
