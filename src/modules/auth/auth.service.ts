import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from './types/JwtPayload';

@Injectable()
export class AuthService {
  constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) {}

    private async validateUser(loginDto: LoginDto) {
        const existUser = await this.usersService.findOneByEmail(loginDto.email);
        if(!existUser) throw new NotFoundException('Người dùng không tồn tại');

        const isPasswordCorrect = await compare(loginDto.password, existUser.password);
        if(!isPasswordCorrect) throw new NotFoundException('Sai mật khẩu');

        return existUser;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        const payload: AuthJwtPayload = {sub: user.id, email: user.email, role: user.role};
        return { 
            username: user.name,
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
