import * as crypto from 'crypto';
import { Configs } from '../../config/config';
import { Expose } from 'class-transformer';
import { AuthService } from '../../application/services/auth.service';
import { UserRoles } from '../../API/types/userRoles';
import { BadRequestException } from '@nestjs/common';

export class DbUser {
  @Expose() _id;
  @Expose() name: string;
  @Expose() surname: string;
  @Expose() email: string;
  @Expose() password: string;
  @Expose() token: string;
  @Expose() dob: Date;
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

  public changeBalance(n: number) {
    this.balance -= n;
    if (this.balance < 0) throw new BadRequestException();
  }

  public async generateToken(authService: AuthService): Promise<void> {
    this.token = await authService.getToken({id: this.email, role: this.role});
  }

}