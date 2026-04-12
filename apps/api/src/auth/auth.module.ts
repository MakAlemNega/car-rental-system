import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_CHANGE_ME', // Use an env variable!
      signOptions: { expiresIn: '1d' }, // Token lasts for 1 day
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
