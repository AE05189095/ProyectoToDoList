import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule]
})
export class AddTaskPage {

  title: string = '';
  description: string = '';
  selectedType: string = 'Work';
  taskTypes = ['Work', 'Home', 'Business'];

  constructor(private taskService: TaskService, private router: Router) {}

  saveTask() {
    // Require title and some description text before saving
    if (!this.title.trim() || !this.description.trim()) return;
    this.taskService.addTask(this.title.trim(), this.description.trim(), this.selectedType as any);
    this.router.navigateByUrl('/tabs/dashboard');
  }

  cancel() {
    this.router.navigateByUrl('/tabs/dashboard');
  }

  // Reset form fields when the page becomes active (handles cached pages)
  ionViewWillEnter() {
    this.title = '';
    this.description = '';
    this.selectedType = 'Work';
  }
}
