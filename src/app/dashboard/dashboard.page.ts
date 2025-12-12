import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task.interface';
import { Observable } from 'rxjs';

import { 
  IonContent,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonItem,
    IonLabel,
    IonList,
    CommonModule,
    FormsModule,
  ],
})
export class DashboardPage {

  taskService = inject(TaskService);
  router = inject(Router);

  constructor() {
    // Asegurarnos de cargar las tareas del usuario actual al entrar al dashboard
    this.taskService.reloadForCurrentUser();
  }

  // Observable de tareas para plantilla
  tasks$: Observable<Task[]> = this.taskService.tasks.asObservable();

  // Email del usuario actualmente autenticado (o null)
  get currentUserEmail(): string | null {
    return this.taskService.currentUserEmail();
  }

  // Se eliminan variables de estado no utilizadas para esta vista
  // filterType: string = 'all'; 
  // hideCompleted: boolean = false; 

  get pendingCount(): number {
    return this.taskService.tasks.value.filter((t: Task) => !t.completed).length;
  }

  get completedCount(): number {
    return this.taskService.tasks.value.filter((t: Task) => t.completed).length;
  }

  get deletedCount(): number {
    return this.taskService.deleted.value.length;
  }

  toggleTask(task: Task) {
    this.taskService.toggleCompleted(task.id);
  }

  openDetails(id: number) {
    this.router.navigateByUrl(`/tabs/details/${id}`);
  }

  // Se elimina la función deleteTask ya que no es necesaria para replicar la vista de la imagen
  // deleteTask(id: number) {
  //   this.taskService.deleteTask(id);
  // }

  logout() {
    localStorage.removeItem('isAuthenticated');
    // Remove current user and reload tasks to avoid showing other user's data
    localStorage.removeItem('todolist_current_user');
    this.taskService.reloadForCurrentUser();
    this.router.navigateByUrl('/login');
  }
}