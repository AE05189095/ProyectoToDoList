import { Injectable, signal } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'my_todo_list_tasks';
  private USERS_KEY = 'todolist_users'; // <-- NUEVA CLAVE PARA USUARIOS
  
  public tasks = signal<Task[]>(this.loadTasksFromStorage());

  constructor() {}

  // ==========================================================
  // === LÓGICA DE GESTIÓN DE TAREAS (CRUD) ===
  // ==========================================================

  private loadTasksFromStorage(): Task[] {
    const tasksJson = localStorage.getItem(this.storageKey);
    const storedTasks = tasksJson ? JSON.parse(tasksJson) : [];
    return storedTasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt) 
    }));
  }

  private saveTasksToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks()));
  }

  addTask(name: string, description: string, type: Task['type']): void {
    const id = new Date().getTime(); 
    const taskToAdd: Task = {
      id: id,
      name: name,
      description: description,
      type: type,
      completed: false,
      createdAt: new Date()
    };

    this.tasks.update(currentTasks => {
      const updatedTasks = [taskToAdd, ...currentTasks];
      this.saveTasksToStorage();
      return updatedTasks;
    });
  }

  toggleCompleted(id: number): void {
    this.tasks.update(currentTasks => {
      const updatedTasks = currentTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      this.saveTasksToStorage();
      return updatedTasks;
    });
  }

  deleteTask(id: number): void {
    this.tasks.update(currentTasks => {
      const updatedTasks = currentTasks.filter(task => task.id !== id);
      this.saveTasksToStorage();
      return updatedTasks;
    });
  }

  updateTask(id: number, changes: Partial<Task>): void {
    this.tasks.update(currentTasks => {
      const updatedTasks = currentTasks.map(task =>
        task.id === id ? { ...task, ...changes } : task
      );
      this.saveTasksToStorage();
      return updatedTasks;
    });
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks().find(task => task.id === id);
  }

  // ==========================================================
  // === LÓGICA DE GESTIÓN DE USUARIOS (LOGIN/REGISTER) ===
  // ==========================================================
  
  private loadUsers(): any {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  }

  private saveUsers(users: any): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  /**
   * REQUISITO 1: Registra un nuevo usuario si no existe.
   * @returns true si el registro fue exitoso, false si el email ya existe.
   */
  registerUser(email: string, password: string): boolean {
    const users = this.loadUsers();
    if (users[email]) {
      return false; 
    }
    users[email] = { password: password };
    this.saveUsers(users);
    return true; 
  }

  /**
   * REQUISITO 3 y 4: Verifica credenciales de usuario.
   * @returns true si el usuario y la contraseña son correctos.
   */
  verifyUser(email: string, password: string): boolean {
    const users = this.loadUsers();
    const user = users[email];
    
    // Si el usuario existe Y la contraseña es correcta
    if (user && user.password === password) {
      return true;
    }
    return false;
  }
  
  /**
   * REQUISITO 2: Comprueba si un email está registrado.
   * @returns true si el usuario existe.
   */
  userExists(email: string): boolean {
      const users = this.loadUsers();
      return !!users[email];
  }
}