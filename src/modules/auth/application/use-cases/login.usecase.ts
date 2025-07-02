import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { LoginDto } from '../../presentation/dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async execute(loginDTO: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDTO.email },
      relations: ['role'],
    });

    if (!user || !(await bcrypt.compare(loginDTO.password, user.password))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      access_token,
    };
  }
}
