import { StudentProfileResponseDto } from 'src/modules/student/presentation/dto/student-profile-response.dto';

export class ProjectResponseDto {
  id: number;
  title: string;
  description: string;
  type: 'web' | 'mobile';
  semester: string;

  created_by: StudentProfileResponseDto;

  categories: string[]; // e.g., ["E-commerce", "Education"]
  technologies: string[]; // e.g., ["Flutter", "Laravel"]

  analysis: {
    problem_background: string;
    project_goal: string;
    target_user: string;
    system_needs: string;
  };

  media: {
    type: 'image' | 'video' | 'pdf' | 'repo' | 'demo';
    title: string;
    url: string;
  }[];

  members: (StudentProfileResponseDto & {
    is_leader: boolean;
  })[];

  created_at: string;
  updated_at: string;
  is_top_project: boolean;
}
