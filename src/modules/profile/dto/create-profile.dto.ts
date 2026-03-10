import { IsNotEmpty } from "class-validator";

export class CreateProfileDto {
    @IsNotEmpty()
    bio!: string

    @IsNotEmpty()
    avatar!: string
}
