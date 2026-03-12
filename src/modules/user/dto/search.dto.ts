import { IsOptional } from "class-validator";

export class SearchDto{
    @IsOptional()
    phone?: string;

    @IsOptional()
    email?: string;
}