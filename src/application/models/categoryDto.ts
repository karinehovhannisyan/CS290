import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class CategoryDto {
  @Expose() _id: ObjectId;
  @Expose() name: string;
  @Expose() parent: CategoryDto = null;
  @Expose() children: CategoryDto[];
}