import { Expose } from 'class-transformer';
import { DbOrderItemBase } from './DbOrderItemBase';
import { ObjectId } from 'mongoose';

export class DbInsertionOrderItem extends DbOrderItemBase {
  @Expose() product: ObjectId;
}