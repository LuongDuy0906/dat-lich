import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from './types/JwtPayload';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        @Inject(refreshJwtConfig.KEY)
        private readonly refreshTokenService: ConfigType<typeof refreshJwtConfig>
    ) {}

    private async validateUser(loginDto: LoginDto) {
        const existUser = await this.usersService.findOneByPhoneWithPassword(loginDto.phone);
        if(existUser?.deletedAt) throw new NotFoundException('Người dùng không tồn tại');

        const isPasswordCorrect = await compare(loginDto.password, existUser!.password);
        if(!isPasswordCorrect) throw new NotFoundException('Sai mật khẩu');

        return existUser;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        const payload: AuthJwtPayload = {sub: user?.uuid, phone: user?.phone, role: user?.role};
        return { 
            user: user,
            username: user?.profile?.bio,
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, this.refreshTokenService) 
        };
    }

    async refreshToken(uuid: string, phone: string, role: Role){
        const payload: AuthJwtPayload = {sub: uuid, phone: phone, role: role};
        const token = await this.jwtService.sign(payload);

        return {
            role: role,
            access_token: token
        };
    }

    async register(createUserDto: CreateUserDto){
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: createUserDto.phone
            }
        });

        if(existUser){
            throw new ConflictException("Nguoi dung voi so dien thoai da ton tai");
        }

        const hashPassword = await bcrypt.hash(createUserDto.password, 10);

        await this.prisma.user.create({
            data: {
                uuid: v4(),
                email: createUserDto.email,
                phone: createUserDto.phone,
                password: hashPassword,
                role: createUserDto.role,
                profile: {
                    create: {
                        uuid: v4(),
                        bio: createUserDto.email
                    }
                }
            }
        });
        
        const newUser = await this.prisma.user.findUnique({
            where: {
                phone: createUserDto.phone
            },
            select: {
                uuid: true,
                phone: true,
                role: true,
                profile: {
                    select: {
                        bio: true,
                    }
                }
            }
        });

        if(!newUser){
            throw new NotFoundException("Dang ky khon thanh cong");
        };

        const payload: AuthJwtPayload = {sub: newUser.uuid, phone: newUser.phone, role: newUser.role};

        return { 
            username: newUser.profile?.bio,
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, this.refreshTokenService) 
        };
    }
}
