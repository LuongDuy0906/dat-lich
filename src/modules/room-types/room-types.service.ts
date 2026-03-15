import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';

@Injectable()
export class RoomTypesService {
  constructor(private readonly prisma: PrismaService){}

  async create(createRoomTypeDto: CreateRoomTypeDto) {
    const existRoomType = await this.prisma.roomType.findUnique({
      where: {
        name: createRoomTypeDto.name
      },
      select: {
        name: true
      }
    })

    if(existRoomType){
      throw new ConflictException("Loai phong da ton tai");
    }

    return await this.prisma.roomType.create({
      data: {
        uuid: v4(),
        name: createRoomTypeDto.name,
        price: createRoomTypeDto.price,
        description: createRoomTypeDto.description
      }
    });
  }

  async findAll() {
    return await this.prisma.roomType.findMany({
      select: {
        name: true,
        price: true,
        description: true
      }
    });
  }

  async findOne(uuid: string) {
    return await this.prisma.roomType.findUnique({
      where: {
        uuid: uuid
      },
      select: {
        name: true,
        price: true
      }
    });
  }

  async update(uuid: string, updateRoomTypeDto: UpdateRoomTypeDto) {
    const existUser = await this.prisma.roomType.findUnique({
      where: {
        name: updateRoomTypeDto.name
      },
      select: {
        name: true
      }
    })

    if(existUser){
      throw new ConflictException("Loai phong da ton tai")
    }

    const newRoomType = {}
    if(updateRoomTypeDto.name){
      newRoomType['name'] = updateRoomTypeDto.name;
    }
    if(updateRoomTypeDto.price){
      newRoomType['price'] = updateRoomTypeDto.price;
    }
    if(updateRoomTypeDto.description){
      newRoomType['description'] = updateRoomTypeDto.description;
    }

    return await this.prisma.roomType.update({
      where: {
        uuid: uuid
      },
      data: {
        ...newRoomType
      }
    });
  }

  async remove(uuid: string) {
    const date = new Date();

    return await this.prisma.roomType.update({
      where: {
        uuid: uuid
      },
      data: {
        deletedAt: date
      }
    });
  }
}
