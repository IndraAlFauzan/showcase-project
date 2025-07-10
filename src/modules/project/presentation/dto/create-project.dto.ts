import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
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
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  is_leader: boolean;
}

export class CreateProjectDtoSimplified {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ProjectType)
  type: 'web' | 'mobile';

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsOptional()
  @IsArray()
  category_ids?: number[];

  @IsOptional()
  @IsArray()
  technology_ids?: number[];

  @IsString()
  @IsNotEmpty()
  problem_background: string;

  @IsString()
  @IsNotEmpty()
  project_goal: string;

  @IsString()
  @IsNotEmpty()
  target_user: string;

  @IsString()
  @IsNotEmpty()
  system_needs: string;

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

  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members: ProjectMemberDto[];
}
