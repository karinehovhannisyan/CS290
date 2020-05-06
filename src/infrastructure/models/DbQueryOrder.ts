import { Expose } from 'class-transformer';
import { DbOrderBase } from './DbOrderBase';
import { DbUser } from './dbUser';
import { DbQueryOrderItem } from './DbQueryOrderItem';

export class DbQueryOrder extends DbOrderBase {
  @Expose() user: DbUser;
  @Expose() orderItems: DbQueryOrderItem[];
}