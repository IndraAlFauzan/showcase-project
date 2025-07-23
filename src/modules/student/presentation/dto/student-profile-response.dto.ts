export class StudentProfileResponseDto {
  id: number;
  user_id: number;
  nama: string;
  nim: string;
  angkatan: number;
  photo_url: string | null;
  interests: string[];
  technologies: string[];
}
