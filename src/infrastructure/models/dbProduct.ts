import * as crypto from 'crypto';
import { Configs } from '../../config/config';
import { PerType } from '../../domain/perType';
import { Expose } from 'class-transformer';

export class DbProductBase {
  @Expose() name: string;
  @Expose() description: string;
  @Expose() price: number;
  @Expose() inStorage = 0;
  @Expose() per: PerType;
  @Expose() image: string;

  public putImageName(): void {
    if (this.image)
      this.image = crypto
        .createHmac('sha256', Configs.imageSecret)
        .update(this.image.split(".")[0])
        .digest('hex');
  }

  public changeStock(change: number): void {
    this.inStorage += change;
  }
}