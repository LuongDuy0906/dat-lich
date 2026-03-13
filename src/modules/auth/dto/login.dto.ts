import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto{
    @ApiProperty({description: "Số điện thoại người dùng", example: "0379080740"})
    @IsNotEmpty()
    phone!: string;

    @ApiProperty({description: "Mât khẩu người dùng", example: "123456"})
    @IsNotEmpty()
    password!: string;
}