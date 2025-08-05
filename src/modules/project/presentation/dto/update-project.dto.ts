import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProjectType {
  WEB = 'web',
  MOBILE = 'mobile',
}

export enum ProjectMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  REPO = 'repo',
  DEMO = 'demo',
}

class ProjectImageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

class ProjectMemberDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsBoolean()
  @IsNotEmpty()
  is_leader: boolean;
}

export class UpdateProjectDtoSimplified {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  type?: ProjectType;

  @IsOptional()
  @IsString()
  semester?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  category_ids?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  technology_ids?: number[];

  @IsOptional()
  @IsString()
  problem_background?: string;

  @IsOptional()
  @IsString()
  project_goal?: string;

  @IsOptional()
  @IsString()
  target_user?: string;

  @IsOptional()
  @IsString()
  system_needs?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  demo?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members?: ProjectMemberDto[];
}
