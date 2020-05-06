import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { DbOrderBase } from './DbOrderBase';
import { DbInsertionOrderItem } from './DbInsertionOrderItem';

export class DbInsertionOrder extends DbOrderBase {
  @Expose() user: ObjectId;
  @Expose() orderItems: DbInsertionOrderItem[];
}