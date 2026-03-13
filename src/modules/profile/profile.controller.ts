import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/common/file-upload.utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from '../auth/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("profiles")
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @ApiOperation({
    summary: "Lấy thông tin hồ sơ theo id người dùng",
    description: "API lấy thông tin hồ sơ của người dùng dựa trên uuid"
  })
  @ApiBearerAuth()
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  findOneByUserId(@Param('userId') userId: string){
    return this.profileService.findOneByUserUuid(userId);
  }

  @Patch(':uuid')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "API cập nhật thông tin hồ sơ"
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  update(@Param('uuid') uuid: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(uuid, updateProfileDto);
  }

  @Delete(':uuid')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "API xóa hồ sơ"
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  remove(@Param('uuid') uuid: string) {
    return this.profileService.remove(uuid);
  }

  @Patch(':uuid/profile_images')
  @ApiOperation({
    summary: 'Cập nhật ảnh đại diện',
    description: 'Cập nhật thêm ảnh đại diện cho hồ sơ người dùng',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile image file',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  updateAvatar(@Param('uuid') uuid: string, @UploadedFile() file: Express.Multer.File){
    const imageUrl = `/uploads/products/${file.filename}`;
    return this.profileService.updateAvatar(uuid, imageUrl);
  }
}
