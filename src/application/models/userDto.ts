import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() _id;
  @Expose() name: string;
  @Expose() surname: string;
  @Expose() email: string;
  @Expose() token: string;
  @Expose() dob: Date;
  @Expose() address: string;
  @Expose() phone: string;
  @Expose() balance: number;
}