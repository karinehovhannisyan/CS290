import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { PerType } from '../../domain/perType';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductEditDto {
  @ApiModelProperty() @Expose() name: string;
  @ApiModelProperty() @Expose() category: ObjectId;
  @ApiModelProperty() @Expose() description: string;
  @ApiModelProperty() @Expose() price: number;
  @ApiProperty({enum: PerType}) @Expose() per: PerType;
}