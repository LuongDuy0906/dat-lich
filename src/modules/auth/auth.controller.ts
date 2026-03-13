import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("auth")
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @ApiOperation({
      summary: "API dành cho việc đăng nhập"
    })
    @Post('login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

     @ApiOperation({
      summary: "API dành cho việc đăng ký tài khoản"
    })
    @Post('register')
    register(@Body() createUserDto: CreateUserDto){
      return this.authService.register(createUserDto);
    }

    @Post('refresh')
    @ApiBearerAuth()
    @UseGuards(RefreshAuthGuard)
    refresh(@Req() req){
      return this.authService.refreshToken(req.user.uuid, req.user.phone, req.user.role);
    }
}
