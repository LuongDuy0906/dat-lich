import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService){}

  async create(createRoomDto: CreateRoomDto) {
    const existRoom = await this.prisma.room.findUnique({
      where: {
        name: createRoomDto.name
      }
    })
    
    if(existRoom){
      throw new ConflictException("Phòng đã tồn tại");
    }

    const existFloor = await this.prisma.floor.findUnique({
      where: {
        uuid: createRoomDto.floorId
      },
      select: {
        id: true,
        capacity: true
      }
    })

    if(!existFloor){
      throw new ConflictException("Tâng không tồn tại")
    }

    const countRooms = await this.prisma.room.count({
      where: {
        floorId: existFloor.id
      }
    })

    if(countRooms >= existFloor.capacity){
      throw new ConflictException("Tầng đã có đủ phòng")
    }

    const newUser = await this.prisma.room.create({
      data: {
        uuid: v4(),
        name: createRoomDto.name,
        description: createRoomDto.description,
        status: createRoomDto.status,
        roomType: {
          connect: {
            uuid: createRoomDto.roomTypeId
          }
        },
        floor: {
          connect: {
            uuid: createRoomDto.floorId
          }
        }
      }
    });
    
    return newUser;
  }

  async findAll() {
    return await this.prisma.room.findMany({
      select: {
        name: true,
        status: true,
        floor: {
          select: {
            name: true
          }
        },
        roomType: {
          select: {
            name: true,
            price: true
          }
        }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
