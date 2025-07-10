// modules/student/presentation/controllers/student.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateStudentProfileDto } from '../dto/create-student-profile.dto';

import { GetStudentProfileUseCase } from '../../application/use-cases/get-student-profile.usecase';
import { GetAllStudentProfilesUseCase } from '../../application/use-cases/get-all-student-profiles.usecase';
import { UpdateStudentProfileUseCase } from '../../application/use-cases/update-student-profile.usecase';
import { DeleteStudentProfileUseCase } from '../../application/use-cases/delete-student-profile.usecase';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateStudentProfileUseCase } from '../../application/use-cases/create-student-profile.usecase';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { JwtPayload } from 'src/shared/interface/jwt-payload.interface';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { log } from 'console';
import { use } from 'passport';
import { multerStudentPhotoStorage } from 'src/shared/helper/multer.helper';

@Controller('students')
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentController {
  constructor(
    private readonly createStudent: CreateStudentProfileUseCase,
    private readonly getStudent: GetStudentProfileUseCase,
    private readonly getAllStudents: GetAllStudentProfilesUseCase,
    private readonly updateStudent: UpdateStudentProfileUseCase,
    private readonly deleteStudent: DeleteStudentProfileUseCase,
  ) {}

  @Post()
  @Roles('mahasiswa', 'admin')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/student-photos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `photo-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: CreateStudentProfileDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const photo_url = photo
      ? `/uploads/student-photos/${photo.filename}`
      : dto.photo_url;

    const payload = { ...dto, photo_url };
    const result = await this.createStudent.execute(payload, user.sub);
    log('Student profile created:', user.sub);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Student profile created successfully',
      data: result,
    };
  }

  @Get()
  @Roles('admin', 'dosen')
  async findAll() {
    const result = await this.getAllStudents.execute();
    return {
      status_code: HttpStatus.OK,
      message: 'List of student profiles',
      data: result,
    };
  }

  @Get('me')
  @Roles('mahasiswa')
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    const result = await this.getStudent.byUserId(user.sub);
    return {
      status_code: HttpStatus.OK,
      message: 'Your student profile retrieved',
      data: result,
    };
  }

  @Get(':id')
  @Roles('admin', 'dosen')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getStudent.byId(id);
    return {
      status_code: HttpStatus.OK,
      message: 'Student profile retrieved',
      data: result,
    };
  }
  @Put('me')
  @Roles('mahasiswa')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: multerStudentPhotoStorage,
    }),
  )
  async updateByUserId(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    const photo_url = photo
      ? `/uploads/student-photos/${photo.filename}`
      : dto.photo_url;
    const result = await this.updateStudent.byUserId(user.sub, {
      ...dto,
      photo_url,
    });

    return {
      status_code: HttpStatus.OK,
      message: 'Student profile updated successfully',
      data: result,
    };
  }

  @Put(':id')
  @Roles('dosen', 'admin')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: multerStudentPhotoStorage,
    }),
  )
  async updateByProfileId(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    const photo_url = photo
      ? `/uploads/student-photos/${photo.filename}`
      : dto.photo_url;
    const result = await this.updateStudent.byProfileId(id, {
      ...dto,
      photo_url,
    });

    return {
      status_code: HttpStatus.OK,
      message: 'Student profile updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteStudent.execute(id);
    return {
      status_code: HttpStatus.OK,
      message: 'Student profile deleted successfully',
      data: null,
    };
  }
}
