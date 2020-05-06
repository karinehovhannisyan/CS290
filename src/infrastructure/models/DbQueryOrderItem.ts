import { Expose } from 'class-transformer';
import { DbOrderItemBase } from './DbOrderItemBase';
import { DbQueryProduct } from './dbQueryProduct';

export class DbQueryOrderItem extends DbOrderItemBase {
  @Expose() product: DbQueryProduct;
}