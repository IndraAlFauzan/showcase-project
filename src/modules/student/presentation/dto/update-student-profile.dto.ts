// modules/student/presentation/dto/update-student-profile.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  nim?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  angkatan?: number;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsOptional()
  @IsArray()
  interest_ids?: number[];

  @IsOptional()
  @IsArray()
  technology_ids?: number[];
}
