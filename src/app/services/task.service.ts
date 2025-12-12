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
  private CURRENT_USER_KEY = 'todolist_current_user';

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

  private saveTasks(tasksToSave?: Task[]): void {
    const key = this.getTasksKey();
    const data = tasksToSave ?? this.tasks();
    localStorage.setItem(key, JSON.stringify(data));
  }

  private saveDeleted(deletedToSave?: Task[]): void {
    const key = this.getDeletedKey();
    const data = deletedToSave ?? this.deleted();
    localStorage.setItem(key, JSON.stringify(data));
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
      this.saveTasks(updated);
      return updated;
    });
  }

  toggleCompleted(id: number): void {
    this.tasks.update(tasks => {
      const updated = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      this.saveTasks(updated);
      return updated;
    });
  }

  deleteTask(id: number): void {
    const deletedTask = this.tasks().find(t => t.id === id);

    this.tasks.update(tasks => {
      const updated = tasks.filter(t => t.id !== id);
      this.saveTasks(updated);
      return updated;
    });

    if (deletedTask) {
      this.deleted.update(deleted => {
        const updatedDeleted = [deletedTask, ...deleted];
        this.saveDeleted(updatedDeleted);
        return updatedDeleted;
      });
    }
  }

  updateTask(id: number, changes: Partial<Task>): void {
    this.tasks.update(tasks => {
      const updated = tasks.map(task =>
        task.id === id ? { ...task, ...changes } : task
      );
      this.saveTasks(updated);
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

  // Devuelve el email del usuario actual (o null)
  private getCurrentUserEmail(): string | null {
    return localStorage.getItem(this.CURRENT_USER_KEY);
  }

  // Devuelve el email del usuario actual (público)
  public currentUserEmail(): string | null {
    return this.getCurrentUserEmail();
  }

  // Construye la key de tasks para el usuario actual. Si no hay usuario, retorna la key global (compatibilidad).
  private getTasksKey(): string {
    const email = this.getCurrentUserEmail();
    return email ? `${this.TASKS_KEY}_${email}` : this.TASKS_KEY;
  }

  // Construye la key de deleted para el usuario actual. Si no hay usuario, retorna la key global (compatibilidad).
  private getDeletedKey(): string {
    const email = this.getCurrentUserEmail();
    return email ? `${this.DELETED_KEY}_${email}` : this.DELETED_KEY;
  }

  /**
   * Fuerza la recarga de las tareas desde storage para el usuario actual.
   * Llamar después de hacer login/logout o cambiar de usuario.
   */
  public reloadForCurrentUser(): void {
    // Cargar las tareas y eliminadas del usuario actual.
    // NOTA: No migramos ni copiamos datos globales a usuarios nuevos para evitar
    // que un usuario recién creado herede tareas de otros usuarios.
    const loaded = this.loadTasksFromStorage();
    const loadedDeleted = this.loadDeletedFromStorage();
    this.tasks.set(loaded);
    this.deleted.set(loadedDeleted);
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

    // Inicializar keys por usuario vacías para asegurar dashboard vacío en nuevas cuentas
    try {
      const tasksKey = `${this.TASKS_KEY}_${email}`;
      const deletedKey = `${this.DELETED_KEY}_${email}`;
      if (localStorage.getItem(tasksKey) == null) {
        localStorage.setItem(tasksKey, JSON.stringify([]));
      }
      if (localStorage.getItem(deletedKey) == null) {
        localStorage.setItem(deletedKey, JSON.stringify([]));
      }
    } catch (e) {
      // Si localStorage no está disponible, no interrumpimos el registro.
    }

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
