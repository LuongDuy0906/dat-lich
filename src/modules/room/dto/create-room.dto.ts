import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { RoomStatus } from "src/generated/prisma/enums";

export class CreateRoomDto {
    @ApiProperty({description: "UUID Loại phòng", example: "fasfasfsa"})
    @IsNotEmpty()
    @IsUUID()
    roomTypeId!: string;

    @ApiProperty({description: "UUID Tầng", example: "fasfasfsa"})
    @IsNotEmpty()
    @IsUUID()
    floorId!: string;

    @IsNotEmpty()
    @ApiProperty({description: "Tên phòng", example: "Phòng B1"})
    name!: string

    @IsOptional()
    @ApiProperty({description: "Mô tả về phòng", example: "Phòng có 1 phòng tắm, 2 giường"})
    description?: string

    @ApiProperty({description: "Trạng thái", example: "ACTIVE"})
    @IsEnum(RoomStatus)
    @IsOptional()
    status?: RoomStatus;
}
