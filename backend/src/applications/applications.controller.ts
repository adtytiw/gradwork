import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get('my')
  @Roles(Role.STUDENT)
  async findMyApplications(@CurrentUser() user: { id: string }) {
    return this.applicationsService.findMyApplications(user.id);
  }

  @Get('received')
  @Roles(Role.COMPANY)
  async findReceivedApplications(@CurrentUser() user: { id: string }) {
    return this.applicationsService.findReceivedApplications(user.id);
  }

  @Get('job/:jobId')
  @Roles(Role.COMPANY)
  async getApplicationsForJob(
    @Param('jobId') jobId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.applicationsService.getApplicationsForJob(jobId, user.id);
  }

  @Post()
  @Roles(Role.STUDENT)
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(user.id, dto);
  }

  @Patch(':id/status')
  @Roles(Role.COMPANY)
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, user.id, dto);
  }
}
