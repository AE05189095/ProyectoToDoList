import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task.interface';

import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonItem, IonLabel, IonChip, IonFab, IonFabButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonIcon, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonItem, IonLabel, IonChip, IonFab, IonFabButton,
    FormsModule, CommonModule, ReactiveFormsModule
  ],
})
export class TaskDetailsPage implements OnInit {

  taskService = inject(TaskService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId!: number;
  currentTask: Task | undefined;
  editableTask: Partial<Task> = {};
  isEditing: boolean = false;

  taskTypes = ['Work', 'Home', 'Business'];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        this.taskId = +idString;
        this.loadTask();
      } else {
        this.router.navigateByUrl('/tabs/dashboard');
      }
    });
  }

  loadTask() {
    const found = this.taskService.getTaskById(this.taskId);
    if (found) {
      this.currentTask = found;
      this.editableTask = { ...found };
    } else {
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    }
  }

  enterEditMode() {
    this.editableTask = { ...this.currentTask! };
    this.isEditing = true;
  }

  cancelEdit() {
    this.editableTask = { ...this.currentTask! };
    this.isEditing = false;
  }

  saveChanges() {
    if (!this.currentTask) return;

    if (this.currentTask.completed) {
      this.editableTask.completed = false;
    }

    this.taskService.updateTask(this.currentTask.id, this.editableTask);
    this.loadTask();
    this.isEditing = false;
  }

  deleteTask() {
    if (this.currentTask) {
      this.taskService.deleteTask(this.currentTask.id);
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    }
  }

  toggleCompleted() {
    if (this.currentTask) {
      this.taskService.toggleCompleted(this.currentTask.id);
      this.loadTask();
    }
  }

  goBack() {
    this.router.navigateByUrl('/tabs/dashboard');
  }
}
