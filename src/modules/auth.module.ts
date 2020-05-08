import { Module } from '@nestjs/common';
import { AuthService } from '../application/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Configs } from '../config/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../application/extentions/jwtStrategy';
import { MongooseModule } from '@nestjs/mongoose';
import { userProviders } from '../infrastructure/providers/user.providers';


@Module({
    imports: [
        MongooseModule.forFeatureAsync(userProviders),
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secretOrPrivateKey: Configs.privateKey,
            publicKey: Configs.publicKey,
            signOptions: {expiresIn: Configs.tokenTimeout}
        }),

    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
