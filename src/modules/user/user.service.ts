import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Status, User } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        phone: createUserDto.phone
      }
    })

    if(existUser){
      throw new ConflictException("Người dùng với số điện thoại đã tồn tại")
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    let newUser: User;

    try{
      newUser = await this.prisma.user.create({
        data: {
          phone: createUserDto.phone,
          password: hashPassword,
          role: createUserDto.role,
          profile: {
            create: {
              bio: createUserDto.phone
            }
          }
        }
      })
      
      return {
        message: "Tạo người dùng thành công"
      }
    } catch (e){
      console.log(e);
      return {
        message: "Tạo người dùng thất bại",
        error: e
      }
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        phone: true,
        role: true,
        status: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByPhone(phone: string){
    return this.prisma.user.findFirst({
      where: {
        phone: phone
      },
      include: {
        profile: {
          select: {
            bio: true
          }
        }
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        phone: true,
        role: true,
        status: true
      }
    });

    if(!existUser){
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    let newUser = {};

    if(updateUserDto.phone){
      newUser['phone'] = updateUserDto.phone;
    }
    if(updateUserDto.password){
      newUser['password'] = updateUserDto.password;
    }
    if(updateUserDto.role){
      newUser['role'] = updateUserDto.role;
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id
      },
      data:{
        ...newUser
      }
    })

    return updatedUser;
  }

  async remove(id: number) {
    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        status: Status.INACTIVE
      }
    })
  }
}
