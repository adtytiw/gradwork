import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @CurrentUser() user: { id: string; email: string },
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(user.id, dto);
  }

  @Get('me')
  async getMe(@CurrentUser() user: { id: string; email: string }) {
    return this.authService.getMe(user.id);
  }
}
