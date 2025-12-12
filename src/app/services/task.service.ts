import { Injectable, signal } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // ================================
  // === LOCALSTORAGE KEYS ===
  // ================================
  private TASKS_KEY = 'my_todo_list_tasks';
  private DELETED_KEY = 'my_todo_list_deleted';
  private USERS_KEY = 'todolist_users';

  // ================================
  // === SIGNALS ===
  // ================================
  public tasks = signal<Task[]>(this.loadTasksFromStorage());
  public deleted = signal<Task[]>(this.loadDeletedFromStorage());

  constructor() {}

  // ==========================================================
  // === LOAD / SAVE TASKS FROM STORAGE ===
  // ==========================================================

  private loadTasksFromStorage(): Task[] {
    const json = localStorage.getItem(this.TASKS_KEY);
    const stored = json ? JSON.parse(json) : [];

    return stored.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  private loadDeletedFromStorage(): Task[] {
    const json = localStorage.getItem(this.DELETED_KEY);
    const stored = json ? JSON.parse(json) : [];

    return stored.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  private saveTasks(): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(this.tasks()));
  }

  private saveDeleted(): void {
    localStorage.setItem(this.DELETED_KEY, JSON.stringify(this.deleted()));
  }

  // ==========================================================
  // === CRUD DE TAREAS ===
  // ==========================================================

  addTask(name: string, description: string, type: Task['type']): void {
    const newTask: Task = {
      id: Date.now(),
      name,
      description,
      type,
      completed: false,
      createdAt: new Date()
    };

    this.tasks.update(tasks => {
      const updated = [newTask, ...tasks];
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  toggleCompleted(id: number): void {
    this.tasks.update(tasks => {
      const updated = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      localStorage.setItem(this.TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  deleteTask(id: number): void {
    const deletedTask = this.tasks().find(t => t.id === id);

    this.tasks.update(tasks => {
      const updated = tasks.filter(t => t.id !== id);
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(updated));
      return updated;
    });

    if (deletedTask) {
      this.deleted.update(deleted => {
        const updatedDeleted = [deletedTask, ...deleted];
        localStorage.setItem(this.DELETED_KEY, JSON.stringify(updatedDeleted));
        return updatedDeleted;
      });
    }
  }

  updateTask(id: number, changes: Partial<Task>): void {
    this.tasks.update(tasks => {
      const updated = tasks.map(task =>
        task.id === id ? { ...task, ...changes } : task
      );

      localStorage.setItem(this.TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks().find(t => t.id === id);
  }

  // ==========================================================
  // === GESTIÓN DE USUARIOS (LOGIN / REGISTER) ===
  // ==========================================================

  private loadUsers(): Record<string, any> {
    const json = localStorage.getItem(this.USERS_KEY);
    return json ? JSON.parse(json) : {};
  }

  private saveUsers(users: any): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  /**
   * Registra un usuario nuevo si no existe.
   * @returns true = registrado, false = email ya existe
   */
  registerUser(email: string, password: string): boolean {
    const users = this.loadUsers();

    if (users[email]) return false;

    users[email] = { password };
    this.saveUsers(users);

    return true;
  }

  /**
   * Verifica credenciales de inicio de sesión.
   */
  verifyUser(email: string, password: string): boolean {
    const users = this.loadUsers();
    const user = users[email];

    return !!(user && user.password === password);
  }

  /**
   * Comprueba si un email ya está registrado.
   */
  userExists(email: string): boolean {
    const users = this.loadUsers();
    return !!users[email];
  }
}
