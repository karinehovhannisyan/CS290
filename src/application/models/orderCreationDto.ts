import { ObjectId } from 'mongoose';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemCreationDto {
  @ApiProperty() @Expose() product: ObjectId;
  @ApiProperty() @Expose() quantity: number;
}
export class OrderCreationDto {
  @ApiProperty() @Expose() date: Date;
  @ApiProperty() @Expose() address: string;
  @ApiProperty({type: OrderItemCreationDto, isArray: true}) @Expose() orderItems: [OrderItemCreationDto]
}
