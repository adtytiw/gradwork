import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(JobType)
  type: JobType;
}

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(JobType)
  @IsOptional()
  type?: JobType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
