// modules/project/infrastructure/repositories/project.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from '../../domain/entities/project.entity';
import { IProjectRepository } from './project.repository.interface';
import { ProjectMediaEntity } from '../../domain/entities/project-media.entity';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,

    @InjectRepository(ProjectMediaEntity)
    private readonly projectMediaRepo: Repository<ProjectMediaEntity>,
  ) {}

  async create(data: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const project = this.repo.create({
      title: data.title,
      description: data.description,
      type: data.type,
      semester: data.semester,

      createdBy: { id: data.createdBy?.id } as any, // ✅ cast ke UserEntity

      categories: data.categories?.map((c) => ({ id: c.id })) as any,
      technologies: data.technologies?.map((t) => ({ id: t.id })) as any,

      analysis: data.analysis,
      media: data.media,
      members: data.members?.map((m) => ({
        user: { id: m.user.id },
        is_leader: m.is_leader,
      })) as any,
    });

    const saved = await this.repo.save(project);

    return await this.repo.findOneOrFail({
      where: { id: saved.id },
      relations: [
        'createdBy',
        'createdBy.student_profile',
        'analysis',
        'media',
        'members',
        'members.user',
        'members.user.student_profile',
        'members.user.student_profile.interests',
        'members.user.student_profile.technologies',
        'technologies',
        'categories',
      ],
    });
  }

  // Find project by ID with all relations
  async findById(id: number): Promise<ProjectEntity | null> {
    return await this.repo.findOne({
      where: { id },
      relations: [
        'createdBy',
        'createdBy.student_profile',
        'createdBy.student_profile.interests',
        'createdBy.student_profile.technologies',
        'analysis',
        'media',
        'members',
        'members.user',
        'members.user.student_profile',
        'members.user.student_profile.interests',
        'members.user.student_profile.technologies',
        'categories',
        'technologies',
      ],
    });
  }

  async findAll(): Promise<ProjectEntity[]> {
    return await this.repo.find({
      relations: [
        'createdBy',
        'analysis',
        'media',
        'members',
        'members.user',
        'categories',
        'technologies',
      ],
    });
  }

  async findByUserId(userId: number): Promise<ProjectEntity[]> {
    return await this.repo.find({
      order: {
        is_top_project: 'DESC',
        created_at: 'DESC',
      },
      where: {
        createdBy: {
          id: userId,
        },
      },
      relations: [
        'createdBy',
        'analysis',
        'media',
        'members',
        'members.user',
        'categories',
        'technologies',
      ],
    });
  }

  async update(
    id: number,
    data: Partial<ProjectEntity>,
  ): Promise<ProjectEntity> {
    const existing = await this.repo.findOne({
      where: { id },
      relations: ['media', 'analysis', 'categories', 'technologies', 'members'],
    });

    if (!existing) throw new NotFoundException('Project tidak ditemukan');

    // Update field biasa
    existing.title = data.title ?? existing.title;
    existing.description = data.description ?? existing.description;
    existing.type = data.type ?? existing.type;
    existing.semester = data.semester ?? existing.semester;

    if (data.media) {
      await this.projectMediaRepo.delete({ project: { id } });

      const newMedia = data.media.map((m) =>
        this.projectMediaRepo.create({
          type: m.type,
          title: m.title,
          url: m.url,
          project: { id } as any,
        }),
      );

      await this.projectMediaRepo.save(newMedia);

      // ✅ Tambahkan ini agar tidak error
      existing.media = await this.projectMediaRepo.find({
        where: { project: { id } },
        order: { created_at: 'ASC' },
      });
    }

    // Simpan entity utama
    await this.repo.save(existing);

    // Kembalikan project lengkap
    return await this.repo.findOneOrFail({
      where: { id },
      relations: [
        'createdBy',
        'media',
        'analysis',
        'technologies',
        'categories',
        'members',
        'members.user',
        'members.user.student_profile',
      ],
    });
  }

  async findAllWithDetails(): Promise<ProjectEntity[]> {
    return await this.repo.find({
      relations: [
        'createdBy',
        'createdBy.student_profile',
        'analysis',
        'media',
        'members',
        'members.user',
        'members.user.student_profile',
        'members.user.student_profile.interests',
        'members.user.student_profile.technologies',
        'technologies',
        'categories',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async setTopProject(id: number, value: boolean): Promise<void> {
    await this.repo.update(id, { is_top_project: value });
  }
}
