import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPayload } from "../types/JwtPayload";
import refreshJwtConfig from "src/config/refresh-jwt.config";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt'){
    constructor(
        @Inject(refreshJwtConfig.KEY)
        private readonly refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refreshJwtConfiguration.secret as string,
        });
    }
    validate(payload: AuthJwtPayload): unknown {
        return {userId: payload.sub, phone: payload.phone, role: payload.role};
    }

}