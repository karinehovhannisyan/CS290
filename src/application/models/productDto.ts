import { Expose } from 'class-transformer';
import { PerType } from '../../domain/perType';
import { CategoryDto } from './categoryDto';

export class ProductDto {
  @Expose() name: string;
  @Expose() _id;
  @Expose() category: CategoryDto;
  @Expose() description: string;
  @Expose() price: number;
  @Expose() inStorage: number;
  @Expose() per: PerType;
  @Expose() image: string;
}