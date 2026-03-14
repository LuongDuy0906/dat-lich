import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoomModule } from './modules/room/room.module';
import { RoomTypesModule } from './modules/room-types/room-types.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }), AuthModule, ProfileModule, RoomModule, RoomTypesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
