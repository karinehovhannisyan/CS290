import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '../models/userDto';
import { UserRegistrationDto } from '../models/userRegistrationDto';
import { Model, ObjectId } from 'mongoose';
import { DbUser } from '../../infrastructure/models/dbUser';
import { Configs } from '../../config/config';
import { Mapper } from '../extentions/mapper';
import { UserDocument } from '../../infrastructure/models/interfaces/userDocument';
import { AuthService } from './auth.service';
import { UserRoles } from '../../API/types/userRoles';
import { InjectModel } from '@nestjs/mongoose';
import { UserEditDto } from '../models/userEditDto';
import { ProductDto } from '../models/productDto';

@Injectable()
export class UserService {
  constructor(@InjectModel(Configs.providers.user) private userModel: Model<UserDocument>, private readonly authService: AuthService) {
  }

  public async registerAsync(userRegistrationDto: UserRegistrationDto): Promise<UserDto> {
    if (userRegistrationDto.password !== userRegistrationDto.confirmPassword) {
      throw new BadRequestException();
    }
    if (await this.userModel.countDocuments({ email: userRegistrationDto.email }).exec())
      throw new ConflictException();

    const dbUser: DbUser = Mapper.Map(DbUser, userRegistrationDto);

    dbUser.putRole(UserRoles.user);
    dbUser.hashPassword();
    await dbUser.generateToken(this.authService);

    let newUserModel = new this.userModel(dbUser);
    newUserModel = await newUserModel.save();
    return Mapper.Map(UserDto, newUserModel);
  }

  public async loginAsync(email: string, password: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ email: email }).exec();

    if (!user)
      throw new NotFoundException();

    const dbUser: DbUser = Mapper.Map(DbUser, user);

    if (!dbUser.checkPassword(password))
      throw new ForbiddenException();

    await dbUser.generateToken(this.authService);

    Object.assign(user, dbUser);
    await user.save();

    return Mapper.Map(UserDto, dbUser);
  }

  public async editAsync(userId: ObjectId, userEditDto: UserEditDto): Promise<UserDto> {
    if (userEditDto.password && userEditDto.password !== userEditDto.confirmPassword) {
      throw new BadRequestException();
    }
    const dbUser = await this.userModel.findById(userId);

    const userDomain = Mapper.Map(DbUser, userEditDto, true);

    if (userDomain.password)
      userDomain.hashPassword();

    Object.assign(dbUser, userDomain);
    await dbUser.save();

    return Mapper.Map(UserDto, dbUser);
  }

  public async getByIdAsync(id: ObjectId): Promise<UserDto> {
    const user = await this.userModel.findById(id);

    if(!user)
      throw new NotFoundException();

    return Mapper.Map(UserDto, user);
  }
}
