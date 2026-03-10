import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "src/generated/prisma/enums";

export class CreateUserDto {
    @IsOptional()
    name?: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    password!: string

    @IsEnum(Role)
    role!: Role;
}
