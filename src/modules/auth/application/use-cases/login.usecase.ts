import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { RoleEntity } from 'src/modules/user/domain/entities/role.entity';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      status_code: 200,
      message: 'Login berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        access_token,
      },
    };
  }
}
