import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { RoleEntity } from 'src/modules/user/domain/entities/role.entity';

import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const roleRepo = dataSource.getRepository(RoleEntity);

  const roles = ['admin', 'dosen', 'mahasiswa'];

  for (const name of roles) {
    const exists = await roleRepo.findOne({ where: { name } });
    if (!exists) {
      const role = roleRepo.create({ name });
      await roleRepo.save(role);
      console.log(`✅ Role '${name}' berhasil dibuat`);
    } else {
      console.log(`ℹ️ Role '${name}' sudah ada`);
    }
  }

  await app.close();
}

bootstrap();
