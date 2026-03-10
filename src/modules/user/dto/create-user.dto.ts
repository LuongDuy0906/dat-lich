import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "src/generated/prisma/enums";

export class CreateUserDto {
    @IsNotEmpty()
    phone!: string

    @IsNotEmpty()
    password!: string

    @IsEnum(Role)
    role!: Role;
}
