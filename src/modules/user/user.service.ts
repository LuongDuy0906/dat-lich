import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus, User } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from '../profile/dto/update-password.dto';


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
          uuid: uuidv4(),
          phone: createUserDto.phone,
          email: createUserDto.email,
          password: hashPassword,
          role: createUserDto.role,
          profile: {
            create: {
              uuid: uuidv4(),
              bio: createUserDto.phone,
              status: UserStatus.ACTIVE
            }
          }
        },
        include: {
          profile: true
        }
      })
      
      return {
        message: "Tạo người dùng thành công",
        user: newUser
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
        email: true,
        role: true,
        profile: {
          select: {
            bio: true,
            avatar: true
          }
        }
      }
    });
  }

  findOneByUuid(uuid: string) {
    return `This action returns a #${uuid} user`;
  }

  findOneByPhoneWithoutPassword(phone: string){
    return this.prisma.user.findFirst({
      where: {
        phone: phone,
        deletedAt: null
      },
      select: {
        phone: true,
        email: true,
        role: true,
        password: true,
        profile: {
          select: {
            bio: true,
            avatar: true
          }
        }
      }
    });
  }

  findOneByPhoneWithPassword(phone: string){
    return this.prisma.user.findFirst({
      where: {
        phone: phone,
      },
      select: {
        phone: true,
        role: true,
        password: true,
        deletedAt: true,
        uuid: true,
        profile: {
          select: {
            bio: true
          }
        }
      }
    });
  }

  findOneByEmail(email: string){
    return this.prisma.user.findUnique({
      where: {
        email: email,
        deletedAt: null
      },
      select: {
        phone: true,
        email: true,
        role: true,
        profile: {
          select: {
            bio: true,
            avatar: true
          }
        }
      }
    })
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        uuid: uuid
      },
      select: {
        phone: true,
        role: true,
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
        uuid: uuid
      },
      data:{
        ...newUser
      }
    })

    return updatedUser;
  }

  async updatePassword(uuid: string, updatePasswordDto: UpdatePasswordDto){
    const existUser = await this.prisma.user.findUnique({
      where: {
        uuid: uuid
      }
    })

    if(!existUser){
      throw new NotFoundException("Khong tim thay nguoi dung");
    }
    
    if(!bcrypt.compareSync(updatePasswordDto.recentPassword, existUser.password)){
      throw new ConflictException("Mat khau khong trung khop");
    }

    const newPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    return await this.prisma.user.update({
      where: {
        uuid: uuid
      },
      data: {
        password: newPassword
      }
    })
  }

  async remove(uuid: string) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        uuid: uuid
      }
    })

    if(!existUser){
      throw new NotFoundException("Khong tim thay nguoi dung");
    }

    const deletedAt = new Date();

    return await this.prisma.user.update({
      where: {
        uuid: uuid
      },
      data: {
        deletedAt: deletedAt,
        profile: {
          update: {
            deletedAt: deletedAt
          }
        }
      }
    })
  }
}
