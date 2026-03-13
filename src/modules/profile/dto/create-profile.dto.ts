import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProfileDto {
    @ApiProperty({description: "Tên người dùng", example: "Lương Duy"})
    @IsNotEmpty()
    @IsOptional()
    bio!: string;

    @ApiProperty({description: "Sinh nhật người dùng", example: "06-09-2004"})
    @IsOptional()
    birth_date?: string;

    @ApiProperty({description: "Giới tính người dùng", example: "Nam"})
    @IsOptional()
    gender?: string;

    @ApiProperty({description: "Địa chỉ của người dùng", example: "Căn 202 ...."})
    @IsOptional()
    address?: string;
}
