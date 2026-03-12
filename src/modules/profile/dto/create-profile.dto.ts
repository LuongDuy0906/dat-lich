import { IsNotEmpty } from "class-validator";

export class CreateProfileDto {
    @IsNotEmpty()
    bio!: string;

    birth_date?: string;
    gender?: string;
    address?: string;
}
