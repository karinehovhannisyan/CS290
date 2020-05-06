import { Expose } from 'class-transformer';
import { LevelType } from '../../domain/levelType';

export class CategoryDto {
  @Expose() name: string;
  @Expose() parent: CategoryDto = null;
  @Expose() children: CategoryDto[];
}