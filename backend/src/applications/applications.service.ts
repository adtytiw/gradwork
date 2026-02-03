import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async findMyApplications(userId: string) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      return [];
    }

    return this.prisma.application.findMany({
      where: { studentId: studentProfile.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                companyName: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findReceivedApplications(userId: string) {
    const companyProfile = await this.prisma.companyProfile.findUnique({
      where: { userId },
    });

    if (!companyProfile) {
      return [];
    }

    return this.prisma.application.findMany({
      where: {
        job: { companyId: companyProfile.id },
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            resumeUrl: true,
            user: {
              select: { email: true },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateApplicationDto) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      throw new ForbiddenException('Student profile not found');
    }

    // Check if job exists
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (!job.isActive) {
      throw new ForbiddenException('This job is no longer accepting applications');
    }

    // Check for existing application
    const existing = await this.prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId: dto.jobId,
          studentId: studentProfile.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You have already applied to this job');
    }

    return this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        studentId: studentProfile.id,
      },
      include: {
        job: {
          include: {
            company: {
              select: { companyName: true },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, userId: string, dto: UpdateApplicationStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: { company: true },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.company.userId !== userId) {
      throw new ForbiddenException('You can only update applications for your own jobs');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async getApplicationsForJob(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.company.userId !== userId) {
      throw new ForbiddenException('You can only view applications for your own jobs');
    }

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            resumeUrl: true,
            user: {
              select: { email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
