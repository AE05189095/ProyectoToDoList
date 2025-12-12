/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetailsPage } from './task-details.page';
import { TaskService } from '../services/task.service';

describe('TaskDetailsPage', () => {
  let component: TaskDetailsPage;
  let fixture: ComponentFixture<TaskDetailsPage>;

  const mockRoute = { paramMap: of({ get: (k: string) => '123' }) } as any;
  const mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') } as any;
  const mockTaskService = {
    getTaskById: (id: number) => ({ id, name: 'Test', description: 'desc', type: 'Work', completed: false, createdAt: new Date() })
  } as Partial<TaskService> as TaskService;
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsPage],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();
 
    fixture = TestBed.createComponent(TaskDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});