import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto } from './dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.job.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            description: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async findByCompany(companyId: string) {
    return this.prisma.job.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateJobDto) {
    // Get company profile for this user
    const companyProfile = await this.prisma.companyProfile.findUnique({
      where: { userId },
    });

    if (!companyProfile) {
      throw new ForbiddenException('Company profile not found');
    }

    return this.prisma.job.create({
      data: {
        ...dto,
        companyId: companyProfile.id,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.company.userId !== userId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    return this.prisma.job.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.company.userId !== userId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    await this.prisma.job.delete({ where: { id } });

    return { message: 'Job deleted successfully' };
  }
}
