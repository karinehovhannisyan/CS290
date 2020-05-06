import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserDto {
  @Transform(role => new String(role), {toClassOnly: true}) // TODO
  @Expose() _id: string;
  @Expose() name: string;
  @Expose() surname: string;
  @Expose() email: string;
  @Expose() token: string;
  @Expose() dob: Date;
  @Expose() address: string;
  @Expose() phone: string;
  @Expose() balance: number;
}