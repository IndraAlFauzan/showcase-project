import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateProjectUseCase } from '../../application/use-cases/create-project.usecase';
import { GetMyProjectsUseCase } from '../../application/use-cases/get-my-project.usecase';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/interface/jwt-payload.interface';
import {
  CreateProjectDtoSimplified,
  ProjectMediaType,
} from '../dto/create-project.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly getMyProjects: GetMyProjectsUseCase,
  ) {}

  @Post()
  @Roles('mahasiswa', 'admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'media', maxCount: 10 },
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/project-media',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `media-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async createProjectHandler(
    @UploadedFiles()
    files: { media?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() dto: CreateProjectDtoSimplified,
    @CurrentUser() user: JwtPayload,
  ) {
    const uploaded = [...(files?.media || []), ...(files?.images || [])];
    const publicUrl = process.env.PUBLIC_STORAGE_URL;

    const imageMedia = uploaded.map((file) => ({
      title: file.originalname,
      url: `/uploads/project-media/${file.filename}`,
    }));

    dto.images = [...(dto.images || []), ...imageMedia];

    const result = await this.createProject.execute(dto, user.sub);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: result,
    };
  }

  @Get('me')
  @Roles('mahasiswa', 'admin')
  async getMyProjectsHandler(@CurrentUser() user: JwtPayload) {
    const result = await this.getMyProjects.execute(user.sub);
    return {
      status_code: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data: result,
    };
  }
}
