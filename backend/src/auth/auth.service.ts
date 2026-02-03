import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      throw new ConflictException('User already registered');
    }

    // Create user with profile based on role
    const user = await this.prisma.user.create({
      data: {
        id: userId,
        email: dto.email,
        role: dto.role,
        ...(dto.role === Role.STUDENT && {
          studentProfile: {
            create: {
              firstName: dto.firstName || '',
              lastName: dto.lastName || '',
            },
          },
        }),
        ...(dto.role === Role.COMPANY && {
          companyProfile: {
            create: {
              companyName: dto.companyName || '',
            },
          },
        }),
      },
      include: {
        studentProfile: true,
        companyProfile: true,
      },
    });

    return user;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        companyProfile: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found. Please complete registration.');
    }

    return user;
  }

  async findOrCreateUser(userId: string, email: string) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        companyProfile: true,
      },
    });

    return user;
  }
}
