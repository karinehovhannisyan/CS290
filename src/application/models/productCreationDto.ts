import { Expose } from 'class-transformer';
import { ProductEditDto } from './productEditDto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ProductCreationDto extends ProductEditDto {
  @ApiModelProperty() @Expose() inStorage: number;
}