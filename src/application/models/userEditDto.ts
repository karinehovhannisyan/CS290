import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UserEditDto {
  @ApiModelProperty() readonly name: string;
  @ApiModelProperty() readonly surname: string;
  @ApiModelProperty() readonly password: string;
  @ApiModelProperty() readonly confirmPassword: string;
  @ApiModelProperty() readonly dob: Date;
  @ApiModelProperty() readonly address: string;
  @ApiModelProperty() readonly phone: string;
}