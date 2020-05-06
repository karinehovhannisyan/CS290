import { Expose } from 'class-transformer';
import { LevelType } from '../../domain/levelType';
import { ObjectId } from 'mongoose';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreationDto {
  @ApiModelProperty() @Expose() name: string;
  @ApiProperty({ enum: LevelType}) @Expose() level: LevelType;
  @ApiModelProperty() @Expose() parent: string;
}