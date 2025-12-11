import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task.interface';

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

  // tasks es una señal
  tasks = this.taskService.tasks;

  // Se eliminan variables de estado no utilizadas para esta vista
  // filterType: string = 'all'; 
  // hideCompleted: boolean = false; 

  get pendingCount(): number {
    return this.tasks().filter(t => !t.completed).length;
  }

  get completedCount(): number {
    return this.tasks().filter(t => t.completed).length;
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
    this.router.navigateByUrl('/login');
  }
}