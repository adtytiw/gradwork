import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Public()
  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Get('company/my-jobs')
  @Roles(Role.COMPANY)
  async findMyJobs(@CurrentUser() user: { id: string }) {
    const companyProfile = await this.jobsService['prisma'].companyProfile.findUnique({
      where: { userId: user.id },
    });
    if (!companyProfile) {
      return [];
    }
    return this.jobsService.findByCompany(companyProfile.id);
  }

  @Post()
  @Roles(Role.COMPANY)
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateJobDto,
  ) {
    return this.jobsService.create(user.id, dto);
  }

  @Patch(':id')
  @Roles(Role.COMPANY)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @Roles(Role.COMPANY)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.jobsService.delete(id, user.id);
  }
}
