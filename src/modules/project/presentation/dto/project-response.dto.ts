export class ProjectResponseDto {
  id: number;
  title: string;
  description: string;
  type: 'web' | 'mobile';
  semester: string;

  created_by: {
    id: number;
    email: string;
  };

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

  members: {
    id: number;
    name: string;
    email: string;
    is_leader: boolean;
  }[];

  created_at: string;
  updated_at: string;
}
