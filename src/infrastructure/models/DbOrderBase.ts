import { Expose } from 'class-transformer';

export class DbOrderBase {
  @Expose() date: Date;
  @Expose() address: string;
}