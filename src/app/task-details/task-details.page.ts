import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task.interface';

import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonItem, IonLabel, IonChip
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonIcon, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonItem, IonLabel, IonChip,
    FormsModule, CommonModule
  ],
})
export class TaskDetailsPage implements OnInit {
  
  taskService = inject(TaskService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables de estado
  taskId!: number;
  currentTask: Task | undefined;
  editableTask: Partial<Task> = {}; // Copia editable de la tarea
  isEditing: boolean = false; // Bandera para alternar entre vista y edición

  taskTypes = ['trabajo', 'casa', 'negocios'];

  ngOnInit() {
    // Obtener el ID de la ruta (app.routes.ts -> path: 'details/:id')
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        this.taskId = +idString; // Convertir a número
        this.loadTask();
      } else {
        // Redirigir si no hay ID
        this.router.navigateByUrl('/tabs/dashboard');
      }
    });
  }

  /**
   * Carga la tarea por ID y prepara la copia editable.
   */
  loadTask() {
    // Obtener la tarea actual desde el servicio (TaskService usa señales)
    const found = this.taskService.getTaskById(this.taskId);
    if (found) {
      this.currentTask = found;
      this.editableTask = { ...found };
    } else {
      // Si la tarea no se encuentra (fue eliminada), redirigir
      this.router.navigateByUrl('/tabs/dashboard');
    }
  }

  /**
   * Entra en modo edición y hace una copia fresca de la tarea.
   */
  enterEditMode() {
    this.editableTask = { ...this.currentTask! };
    this.isEditing = true;
  }

  /**
   * Cancela la edición y regresa a la vista.
   */
  cancelEdit() {
    this.isEditing = false;
  }

  /**
   * Guarda los cambios de la tarea.
   */
  saveChanges() {
    if (!this.currentTask) return;

    // Llama al servicio para actualizar la tarea
    this.taskService.updateTask(this.currentTask.id, this.editableTask);

    // Refrescar la referencia local a la tarea
    const updated = this.taskService.getTaskById(this.currentTask.id);
    if (updated) {
      this.currentTask = updated;
      this.editableTask = { ...updated };
    }

    this.isEditing = false;
  }

  /**
   * Elimina la tarea y redirige al Dashboard.
   */
  deleteTask() {
    if (this.currentTask) {
      this.taskService.deleteTask(this.currentTask.id);
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    }
  }

  /**
   * Cambia el estado de completado.
   */
  toggleCompleted() {
    if (this.currentTask) {
      this.taskService.toggleCompleted(this.currentTask.id);
      // Actualizamos la referencia local con el cambio
      const refreshed = this.taskService.getTaskById(this.currentTask.id);
      if (refreshed) {
        this.currentTask = refreshed;
        this.editableTask.completed = refreshed.completed;
      }
    }
  }
  
  /**
   * Vuelve al Dashboard.
   */
  goBack() {
    this.router.navigateByUrl('/tabs/dashboard');
  }
}