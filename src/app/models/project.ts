export interface Project {
  id: number;
  name: string;
  description: string;
  taskCount: number;
  createdAt: string;
}

export interface ProjectRequest {
  name: string;
  description: string;
}