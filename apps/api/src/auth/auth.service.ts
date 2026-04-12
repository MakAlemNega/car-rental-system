import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
  async verifyOtp(phoneNumber: string, submittedOtp: string) {
    // 1. Find the user by phone number
    const user = await this.prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    // 2. Security Check: Does user exist? Does the OTP match?
    if (!user || user.otp !== submittedOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // 3. Expiry Check: Is the OTP still valid?
    if (user.otpExpires && new Date() > user.otpExpires) {
      throw new UnauthorizedException('OTP has expired');
    }

    // 4. Cleanup: Clear the OTP so it can't be used twice
    await this.prisma.user.update({
      where: { phone: phoneNumber },
      data: { otp: null, otpExpires: null },
    });

    // 5. Success: For now, return a message (Next, we'll generate a JWT token)
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      message: 'Authentication successful',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }
}
