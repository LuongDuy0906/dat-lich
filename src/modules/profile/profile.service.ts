import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async findAll() {
    return await this.prisma.profile.findMany({
      select: {
        uuid: true,
        bio: true,
        avatar: true,
        address: true,
        birth_date: true,
        gender: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  findOneByUserUuid(uuid: string){
    return this.prisma.profile.findFirst({
      where: {
        user: {
          uuid: uuid
        }
      },
      select: {
        bio: true,
        avatar: true,
        address: true,
        birth_date: true,
        gender: true,
        uuid: true
      }
    })
  }

  async update(uuid: string, updateProfileDto: UpdateProfileDto, imageUrl: string) {
    const existProfile = await this.prisma.profile.findUnique({
      where: {
        uuid: uuid
      }
    })

    if(!existProfile){
      throw new NotFoundException("Khong tim thay ho so nguoi dung")
    }

    let newProfile = {};
    
    if(updateProfileDto.bio){
      newProfile['bio'] = updateProfileDto.bio;
    }
    if(updateProfileDto.address){
      newProfile['address'] = updateProfileDto.address;
    }
    if(updateProfileDto.birth_date){
      let dOB = new Date(updateProfileDto.birth_date);
      newProfile['birth_date'] = dOB;
    }
    if(updateProfileDto.gender){
      newProfile['gender'] = updateProfileDto.gender;
    }
    newProfile['avatar'] = imageUrl;

    try {
        await this.prisma.profile.update({
          where: {
            uuid: uuid
          },
          data: {
            ...newProfile
          }
        })
        
      return {
        message: "Cap nhat ho so thanh cong"
      }
    } catch (error) {
      console.log(error)
      return {
        message: "Cap nhat ho so that bai",
        error: error
      }
    }
  }

  async remove(uuid: string) {
    return await this.prisma.profile.delete({
      where: {
        uuid: uuid
      }
    });
  }
}
