import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ArrayUnique,
} from 'class-validator';

export class CreateStudentProfileDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  nim: string;

  @Type(() => Number)
  @IsNumber()
  angkatan: number;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  interest_ids?: number[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  technology_ids?: number[];
}
