import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { RoleEntity } from 'src/modules/user/domain/entities/role.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  async execute(name: string, email: string, password: string) {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email sudah terdaftar');

    const role = await this.roleRepo.findOne({ where: { id: 3 } });
    if (!role) throw new NotFoundException('Role tidak ditemukan');

    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      name,
      email,
      password: hashed,
      role,
    });

    await this.userRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role.name,
    };
  }
}
