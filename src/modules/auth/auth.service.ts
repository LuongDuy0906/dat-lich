import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from './types/JwtPayload';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY)
        private readonly refreshTokenService: ConfigType<typeof refreshJwtConfig>
    ) {}

    private async validateUser(loginDto: LoginDto) {
        const existUser = await this.usersService.findOneByPhone(loginDto.phone);
        if(!existUser) throw new NotFoundException('Người dùng không tồn tại');

        const isPasswordCorrect = await compare(loginDto.password, existUser.password);
        if(!isPasswordCorrect) throw new NotFoundException('Sai mật khẩu');

        return existUser;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        const payload: AuthJwtPayload = {sub: user.id, phone: user.phone, role: user.role};
        return { 
            username: user.profile?.bio,
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, this.refreshTokenService) 
        };
    }
}
