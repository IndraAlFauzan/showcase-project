import { Optional } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { NoSpecialChars } from 'src/shared/decorators/no-special-chars.decorator';
import { TrimmedString } from 'src/shared/decorators/trimmed-string.decorator';
export class UpdateTechnologyDto {
  @Optional()
  @IsString()
  @MinLength(2)
  @TrimmedString({
    message: 'Nama technology tidak boleh kosong atau hanya spasi',
  })
  @NoSpecialChars()
  name: string;
}
