import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  @MaxLength(100, { message: 'Nama kategori maksimal 100 karakter' })
  @Matches(/\S/, {
    message: 'Nama kategori tidak boleh kosong atau hanya spasi',
  })
  name?: string;
}
