import * as crypto from 'crypto';
import { Configs } from '../../config/config';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { AuthService } from '../../application/services/auth.service';
import { UserRoles } from '../../API/types/userRoles';

export class DbUser {
  @Expose() name: string;
  // @Expose() _id: ObjectId;
  @Expose() surname: string;
  @Expose() email: string;
  @Expose() password: string;
  @Expose() token: string;
  @Expose() dob: Date;
  @Expose() address: string;
  @Expose() phone: string;
  @Expose() balance: number;
  @Expose() role: UserRoles;

  public putRole(role: UserRoles): void {
    this.role = role;
  }

  public hashPassword(): void {
    if (this.password)
      this.password = crypto
        .createHmac('sha256', Configs.secret)
        .update(this.password)
        .digest('hex');
  }

  public checkPassword(password: string): boolean {
    const hashedPass = crypto
        .createHmac('sha256', Configs.secret)
        .update(password)
        .digest('hex');
    return hashedPass === this.password;
  }

  public async generateToken(authService: AuthService): Promise<void> {
    this.token = await authService.getToken({id: this.email, role: this.role});
  }

}