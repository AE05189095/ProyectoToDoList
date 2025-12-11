export interface Task {
  id: number;
  name: string; // <-- Aquí está como 'name'
  description: string;
  type: 'trabajo' | 'casa' | 'negocios';
  completed: boolean;
  createdAt: Date;
}