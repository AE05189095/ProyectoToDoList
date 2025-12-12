export interface Task {
  id: number;
  name: string; // <-- Aquí está como 'name'
  description: string;
  type: 'Work' | 'Home' | 'Business';
  completed: boolean;
  createdAt: Date;
}