import { DbProductBase } from './dbProduct';
import { Expose } from 'class-transformer';
import { DbQueryCategory } from './dbQueryCategory';

export class DbQueryProduct extends DbProductBase {
  @Expose() category: DbQueryCategory;
}