import { IsString, MinLength } from 'class-validator';
import { NoSpecialChars } from 'src/shared/decorators/no-special-chars.decorator';
import { TrimmedString } from 'src/shared/decorators/trimmed-string.decorator';
export class CreateExpertiseDto {
  @IsString()
  @MinLength(2)
  @TrimmedString({
    message: 'Nama kategori tidak boleh kosong atau hanya spasi',
  })
  @NoSpecialChars()
  name: string;
}
