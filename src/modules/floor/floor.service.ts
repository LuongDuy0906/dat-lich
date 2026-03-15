import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';

@Injectable()
export class FloorService {
  constructor(private readonly prisma: PrismaService){}

  async create(createFloorDto: CreateFloorDto) {
    const existFloor = await this.prisma.floor.findUnique({
      where: {
        name: createFloorDto.name
      }
    })
    
    if(existFloor){
      throw new ConflictException("Tang da ton tai")
    }

    return await this.prisma.floor.create({
      data: {
        uuid: v4(),
        name: createFloorDto.name,
        capacity: createFloorDto.capacity
      }
    });
  }

  async findAll() {
    return await this.prisma.floor.findMany({
      select: {
        name: true,
        capacity: true,
        uuid: true
      }
    });
  }

  async findOne(uuid: string) {
    return await this.prisma.floor.findUnique({
      where: {
        uuid: uuid
      },
      select: {
        uuid: true,
        name: true,
        capacity: true
      }
    });
  }

  async update(uuid: string, updateFloorDto: UpdateFloorDto) {
    const existFloor = await this.prisma.floor.findUnique({
      where: {
        name: updateFloorDto.name
      }
    })

    if(existFloor){
      throw new ConflictException("Tang da ton tai")
    } 

    const newFloor = {};
    
    if(updateFloorDto.name){
      newFloor['name'] = updateFloorDto.name;
    }
    if(updateFloorDto.capacity){
      newFloor['name'] = updateFloorDto.capacity;
    }
    return await this.prisma.floor.update({
      where: {
        uuid: uuid
      },
      data: {
        ...newFloor
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} floor`;
  }
}
