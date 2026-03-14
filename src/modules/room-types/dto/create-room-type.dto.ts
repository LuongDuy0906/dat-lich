import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateRoomTypeDto {
    @ApiProperty({description: "Loại phòng", example: "Phòng VIP"})
    @IsNotEmpty()
    name!: string;

    @ApiProperty({description: "Giá của loại phòng", example: "200000"})
    @IsNotEmpty()
    @IsNumber()
    price!: number;

    @ApiProperty({description: "Mô tả loại phòng", example: "Nhiều vậy phẩm cá nhân phù hợp nhu cầu"})
    @IsOptional()
    description?: string;
}
