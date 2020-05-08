import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from '../services/auth.service';
import { IJwtPayload } from '../interfaces/IJwtPayload';
import { Configs } from '../../config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: Configs.privateKey,
      publicKey: Configs.publicKey,
    });
  }

  public async validate(req: Request, payload: IJwtPayload) {
    if (req.headers["authorization"] && req.headers["authorization"].split(" ")[0] === "Bearer") {
      const user = await this.authService.validateUser(payload, req.headers["authorization"].split(" ")[1]);
      if (user) {
        return user;
      }
    }
    throw new UnauthorizedException();
  }
}
