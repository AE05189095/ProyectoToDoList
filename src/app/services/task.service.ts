import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private TASKS_KEY = 'my_todo_list_tasks';
  private DELETED_KEY = 'my_todo_list_deleted';
  private USERS_KEY = 'todolist_users';
  private CURRENT_USER_KEY = 'todolist_current_user';

  // ========== STATE (reemplazo de signals) ==========
  public tasks = new BehaviorSubject<Task[]>(this.loadTasksFromStorage());
  public deleted = new BehaviorSubject<Task[]>(this.loadDeletedFromStorage());

  constructor() {}

  // ==========================================================
  // === LOAD / SAVE TASKS FROM STORAGE ===
  // ==========================================================

  private loadTasksFromStorage(): Task[] {
    const key = this.getTasksKey();
    const json = localStorage.getItem(key);
    const stored = json ? JSON.parse(json) : [];

    return stored.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  private loadDeletedFromStorage(): Task[] {
    const key = this.getDeletedKey();
    const json = localStorage.getItem(key);
    const stored = json ? JSON.parse(json) : [];

    return stored.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  private saveTasks(tasks?: Task[]): void {
    const key = this.getTasksKey();
    const value = tasks ?? this.tasks.value;
    localStorage.setItem(key, JSON.stringify(value));
  }

  private saveDeleted(tasks?: Task[]): void {
    const key = this.getDeletedKey();
    const value = tasks ?? this.deleted.value;
    localStorage.setItem(key, JSON.stringify(value));
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

    const updated = [newTask, ...this.tasks.value];
    this.tasks.next(updated);
    this.saveTasks(updated);
  }

  toggleCompleted(id: number): void {
    const updated = this.tasks.value.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    this.tasks.next(updated);
    this.saveTasks(updated);
  }

  deleteTask(id: number): void {
    const deletedTask = this.tasks.value.find(t => t.id === id);

    const updatedTasks = this.tasks.value.filter(t => t.id !== id);
    this.tasks.next(updatedTasks);
    this.saveTasks(updatedTasks);

    if (deletedTask) {
      const updatedDeleted = [deletedTask, ...this.deleted.value];
      this.deleted.next(updatedDeleted);
      this.saveDeleted(updatedDeleted);
    }
  }

  updateTask(id: number, changes: Partial<Task>): void {
    const updated = this.tasks.value.map(task =>
      task.id === id ? { ...task, ...changes } : task
    );

    this.tasks.next(updated);
    this.saveTasks(updated);
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.value.find(t => t.id === id);
  }

  // ==========================================================
  // === GESTIÓN DE USUARIOS ===
  // ==========================================================

  private loadUsers(): Record<string, any> {
    const json = localStorage.getItem(this.USERS_KEY);
    return json ? JSON.parse(json) : {};
  }

  private saveUsers(users: any): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getCurrentUserEmail(): string | null {
    return localStorage.getItem(this.CURRENT_USER_KEY);
  }

  public currentUserEmail(): string | null {
    return this.getCurrentUserEmail();
  }

  private getTasksKey(): string {
    const email = this.getCurrentUserEmail();
    return email ? `${this.TASKS_KEY}_${email}` : this.TASKS_KEY;
  }

  private getDeletedKey(): string {
    const email = this.getCurrentUserEmail();
    return email ? `${this.DELETED_KEY}_${email}` : this.DELETED_KEY;
  }

  public reloadForCurrentUser(): void {
    this.tasks.next(this.loadTasksFromStorage());
    this.deleted.next(this.loadDeletedFromStorage());
  }

  registerUser(email: string, password: string): boolean {
    const users = this.loadUsers();

    if (users[email]) return false;

    users[email] = { password };
    this.saveUsers(users);

    try {
      const tasksKey = `${this.TASKS_KEY}_${email}`;
      const deletedKey = `${this.DELETED_KEY}_${email}`;

      if (!localStorage.getItem(tasksKey)) localStorage.setItem(tasksKey, JSON.stringify([]));
      if (!localStorage.getItem(deletedKey)) localStorage.setItem(deletedKey, JSON.stringify([]));
    } catch {}

    return true;
  }

  verifyUser(email: string, password: string): boolean {
    const users = this.loadUsers();
    const user = users[email];
    return !!(user && user.password === password);
  }

  userExists(email: string): boolean {
    const users = this.loadUsers();
    return !!users[email];
  }
}
