import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentProfileDto, UpdateCompanyProfileDto } from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        companyProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateStudentProfile(userId: string, dto: UpdateStudentProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.STUDENT) {
      throw new ForbiddenException('Only students can update student profile');
    }

    return this.prisma.studentProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async updateCompanyProfile(userId: string, dto: UpdateCompanyProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { companyProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.COMPANY) {
      throw new ForbiddenException('Only companies can update company profile');
    }

    return this.prisma.companyProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async getAllStudents() {
    return this.prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getAllCompanies() {
    return this.prisma.companyProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
