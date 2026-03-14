import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { RoomStatus } from "src/generated/prisma/enums";

export class CreateRoomDto {
    @IsNotEmpty()
    @ApiProperty({description: "Tên phòng", example: "Phòng B1"})
    name!: string

    @IsOptional()
    @ApiProperty({description: "Mô tả về phòng", example: "Phòng có 1 phòng tắm, 2 giường"})
    description?: string

    @ApiProperty({description: "Loại phòng", example: "Phòng VIP"})
    type?: number;

    @ApiProperty({description: "Tầng", example: "Tầng 1"})
    floor?: number;

    @ApiProperty({description: "Trạng thái", example: "ACITIVE"})
    @IsEnum(RoomStatus)
    status?: RoomStatus;
}
