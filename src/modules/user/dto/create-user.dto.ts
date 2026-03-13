import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "src/generated/prisma/enums";

export class CreateUserDto {
    @ApiProperty({description: "Email người dùng", example: "example@gmail.com"})
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({description: "Số điện thoại người dùng", example: "0379080740"})
    @IsNotEmpty()
    phone!: string;

    @ApiProperty({description: "Mật khẩu tài khoản", example: "1234"})
    @IsNotEmpty()
    password!: string;

    @ApiProperty({description: "Vai trò của tài khoản", example: "USER"})
    @IsEnum(Role)
    role!: Role;
}
