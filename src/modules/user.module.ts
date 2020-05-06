import { Module } from '@nestjs/common';
import { UserController } from '../API/controllers/user.controller';
import { UserService } from '../application/services/user.service';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { userProviders } from '../infrastructure/providers/user.providers';


@Module({
  imports: [MongooseModule.forFeatureAsync(userProviders), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}
