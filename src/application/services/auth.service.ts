import {JwtService} from "@nestjs/jwt";
import {Model} from "mongoose";
import { Inject, Injectable } from '@nestjs/common';
import { Configs } from '../../config/config';
import { IJwtPayload } from '../interfaces/IJwtPayload';
import { UserDocument } from '../../infrastructure/models/interfaces/userDocument';
import { DbUser } from '../../infrastructure/models/dbUser';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(Configs.providers.user) private userModel: Model<UserDocument>
    ) {}

    public async getToken(payload: IJwtPayload) {
        return this.jwtService.sign(payload);
    }

    public async decodeToken(token: string): Promise<IJwtPayload> {
        return await this.jwtService.decode(token) as IJwtPayload;
    }
    public async validateUser(payload: IJwtPayload, token: string): Promise<DbUser> {
        if (!token) {
            return null;
        }
        if (this.jwtService.decode(token.toString(), Configs.privateKey as any)) {
            const user = await this.userModel.findOne({email: payload.id}).exec();
            if (!user || user.token !== token) {
                return null;
            }
            if (!this.ifOutdated(user.updatedAt)) {
                await user.save();
            }
            return user._doc as DbUser;
        }
        return null;
    }

    private ifOutdated(date: Date): boolean {
        return date && Date.now() - date.getTime() > Configs.tokenTimeout;
    }
}
