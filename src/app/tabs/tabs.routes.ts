import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard', // NUEVO NOMBRE DE RUTA
        loadComponent: () => import('../dashboard/dashboard.page').then((m) => m.DashboardPage), // RUTA ACTUALIZADA
      },
      {
        path: 'add', // Ruta para la página de agregar tarea
        loadComponent: () => import('../add-task/add-task.page').then((m) => m.AddTaskPage),
      },
      {
        path: 'details/:id', // Ruta de detalles (no es una pestaña, pero vive dentro de 'tabs')
        loadComponent: () => import('../task-details/task-details.page').then((m) => m.TaskDetailsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];