import { IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";

export class CreateFloorDto {
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsPositive()
    capacity!: number;
}
