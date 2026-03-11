import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from 'src/generated/prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async findOneByUserId(userId: number){
    return await this.prisma.profile.findUnique({
      where: {
        userId: userId
      },
      select: {
        bio: true,
        avatar: true
      }
    })
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, imageUrl: string) {
    const existProfile = await this.prisma.profile.findUnique({
      where: {
        id: id
      }
    })

    if(!existProfile){
      throw new NotFoundException("Khong tim thay ho so nguoi dung")
    }

    let newProfile = {};
    let url: string = imageUrl;
    if(updateProfileDto.bio){
      newProfile['bio'] = updateProfileDto.bio;
    }
    newProfile['avatar'] = imageUrl;

    try {
      await Promise.all([
        this.prisma.profile.update({
          where: {
            id: id
          },
          data: {
            ...newProfile
          }
        }),

        this.prisma.image.create({
          data: {
            url: url
          }
        })
      ])

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

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
