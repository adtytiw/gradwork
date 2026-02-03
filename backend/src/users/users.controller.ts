import { Controller, Get, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateStudentProfileDto, UpdateCompanyProfileDto } from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('profile/student')
  @Roles(Role.STUDENT)
  async updateStudentProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.usersService.updateStudentProfile(user.id, dto);
  }

  @Patch('profile/company')
  @Roles(Role.COMPANY)
  async updateCompanyProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.usersService.updateCompanyProfile(user.id, dto);
  }
}
