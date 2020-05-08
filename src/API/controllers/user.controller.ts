import { Body, Controller, Get, Post, UseGuards, Request, Patch, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../../application/models/userDto';
import { UserService } from '../../application/services/user.service';
import { RolesGuard } from '../middleware/rolesGuard';
import { Roles } from '../validation/roles';
import { UserRoles } from '../types/userRoles';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Mapper } from '../../application/extentions/mapper';
import { UserRegistrationDto } from '../../application/models/userRegistrationDto';
import { UserEditDto } from '../../application/models/userEditDto';

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  @Roles(UserRoles.guest)
  @UseGuards(RolesGuard)
  public async loginAsync(@Body("email") email: string, @Body("password") password: string): Promise<UserDto> {
    return await this.userService.loginAsync(email, password);
  }

  @Post("register")
  @Roles(UserRoles.guest)
  @UseGuards(RolesGuard)
  public async registerAsync(@Body() userRegistrationDto: UserRegistrationDto): Promise<UserDto> {
    return await this.userService.registerAsync(userRegistrationDto);
  }

  @Get("me")
  @Roles(UserRoles.user)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  public async meAsync(@Request() req): Promise<UserDto> {
    if (!req.user)
      throw new UnauthorizedException();
    return Mapper.Map(UserDto, req.user);
  }

  @Patch()
  @Roles(UserRoles.user)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  public async editAsync(@Request() req, @Body() userEditDto: UserEditDto): Promise<UserDto> {
    return await this.userService.editAsync(req.user._id, userEditDto);
  }
}
