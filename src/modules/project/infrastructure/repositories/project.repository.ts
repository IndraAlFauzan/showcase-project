// modules/project/infrastructure/repositories/project.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from '../../domain/entities/project.entity';
import { IProjectRepository } from './project.repository.interface';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
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

  async findById(id: number): Promise<ProjectEntity | null> {
    return await this.repo.findOne({
      where: { id },
      relations: [
        'createdBy',
        'createdBy.student_profile',
        'createdBy.student_profile.interests', // ✅ Ambil lewat student_profile
        'createdBy.student_profile.technologies', // ✅ Ambil lewat student_profile
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
      relations: [
        'analysis',
        'media',
        'members',
        'members.user',
        'technologies',
        'categories',
      ],
    });

    if (!existing) {
      throw new Error('Project not found');
    }

    // Update field utama
    existing.title = data.title ?? existing.title;
    existing.description = data.description ?? existing.description;
    existing.type = data.type ?? existing.type;
    existing.semester = data.semester ?? existing.semester;

    // Update analysis (OneToOne)
    if (data.analysis) {
      existing.analysis = {
        ...existing.analysis,
        ...data.analysis,
      };
    }

    // Update media (replace semua)
    if (data.media) {
      existing.media = data.media;
    }

    // Update members (replace semua)
    if (data.members) {
      existing.members = data.members.map((m) => ({
        user: { id: m.user.id },
        is_leader: m.is_leader,
      })) as any;
    }

    // Update ManyToMany
    if (data.technologies) {
      existing.technologies = data.technologies.map((t) => ({
        id: t.id,
      })) as any;
    }

    if (data.categories) {
      existing.categories = data.categories.map((c) => ({ id: c.id })) as any;
    }

    await this.repo.save(existing);

    // Reload dengan semua relasi
    return await this.repo.findOneOrFail({
      where: { id },
      relations: [
        'createdBy',
        'analysis',
        'media',
        'members',
        'members.user',
        'technologies',
        'categories',
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
}
