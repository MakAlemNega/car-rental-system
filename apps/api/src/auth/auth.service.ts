import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async generateOtp(phoneNumber: string) {
    // 1. Generate a random 6-digit string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // 2. Set expiration (e.g., 5 minutes from now)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    try {
      // 3. Upsert: Find the user by phone, or create them if they don't exist
      await this.prisma.user.upsert({
        where: { phone: phoneNumber },
        update: { otp, otpExpires: expires },
        create: {
          phone: phoneNumber,
          otp,
          otpExpires: expires,
          role: 'CUSTOMER',
        },
      });

      // 4. In production, you'd trigger the SMS gateway here.
      // For your defense, we will just return it or log it to the console.
      console.log(`[AUTH] OTP for ${phoneNumber}: ${otp}`);

      return { message: 'OTP sent successfully' };
    } catch (error) {
      // Use the error variable to log what actually happened
      console.error('OTP Generation Error:', error);
      throw new InternalServerErrorException('Could not generate OTP');
    }
  }
}
