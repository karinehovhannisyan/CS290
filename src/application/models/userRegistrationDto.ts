import { UserEditDto } from './userEditDto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UserRegistrationDto extends UserEditDto {
  @ApiModelProperty()
  readonly email: string;
}