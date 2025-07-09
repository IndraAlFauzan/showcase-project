export class StudentProfileResponseDto {
  id: number;
  nama: string;
  nim: string;
  angkatan: number;
  photo_url: string | null;
  interests: string[];
  technologies: string[];
}
