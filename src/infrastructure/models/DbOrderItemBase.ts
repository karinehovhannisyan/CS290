import { Expose } from 'class-transformer';

export class DbOrderItemBase {
  @Expose() quantity: number;
}