import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NoSpecialChars } from 'src/shared/decorators/no-special-chars.decorator';
import { TrimmedString } from 'src/shared/decorators/trimmed-string.decorator';

export class CreateInterestDto {
  @IsString()
  @MinLength(2)
  @TrimmedString({
    message: ' Interest tidak boleh kosong atau hanya spasi',
  })
  name: string;
}
