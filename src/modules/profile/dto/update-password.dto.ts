import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDto{

    @IsNotEmpty()
    recentPassword!: string;

    @IsNotEmpty()
    newPassword!: string;
}