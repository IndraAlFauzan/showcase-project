import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from './config/jwt.config';
import { envValidationSchema } from './config/env.validation';
import { RoleEntity } from './modules/user/domain/entities/role.entity';
import { UserEntity } from './modules/user/domain/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ExpertiseModule } from './modules/expertise/expertise.module';
import { TechnologyModule } from './modules/technology/technology.module';
import { InterestModule } from './modules/interest/interest.module';

import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StudentModule } from './modules/student/student.module';
import { ProjectModule } from './modules/project/project.module';
import { CategoryEntity } from './modules/category/domain/entities/category.entity';
import { ExpertiseEntity } from './modules/expertise/domain/entities/expertise.entity';
import { InterestEntity } from './modules/interest/domain/entities/interest.entity';
import { ProjectAnalysisEntity } from './modules/project/domain/entities/project-analysis.entity';
import { ProjectMediaEntity } from './modules/project/domain/entities/project-media.entity';
import { ProjectMemberEntity } from './modules/project/domain/entities/project-member.entity';
import { ProjectEntity } from './modules/project/domain/entities/project.entity';
import { StudentEntity } from './modules/student/domain/entities/student.entity';
import { TechnologyEntity } from './modules/technology/domain/entities/technology.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: +config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        database: config.get('DATABASE_NAME'),
        password: config.get('DATABASE_PASSWORD'),
        autoLoadEntities: true,
        entities: [
          RoleEntity,
          UserEntity,
          CategoryEntity,
          ExpertiseEntity,
          InterestEntity,
          ProjectAnalysisEntity,
          ProjectMediaEntity,
          ProjectMemberEntity,
          ProjectEntity,
          StudentEntity,
          TechnologyEntity,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ExpertiseModule,
    TechnologyModule,
    InterestModule,
    StudentModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
