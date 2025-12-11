import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; // Importación del Guard de seguridad

export const routes: Routes = [
  {
    path: '', // Ruta raíz
    redirectTo: 'login', // Siempre redirigir al login si no hay nada en la URL
    pathMatch: 'full',
  },
  {
    path: 'login', // Ruta de la página de Login
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs', // Ruta para todas las páginas internas de la app
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard], // PROTEGE LAS RUTAS INTERNAS
    children: [
      {
        path: 'dashboard', // Lista de Tareas (Path: /tabs/dashboard)
        loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'add', // Agregar Tarea (Path: /tabs/add)
        loadComponent: () => import('./add-task/add-task.page').then(m => m.AddTaskPage)
      },
      {
        path: 'details/:id', // Detalles de Tarea (Path: /tabs/details/123)
        // **Nota:** Asegúrate de que este archivo exista para evitar errores de compilación.
        loadComponent: () => import('./task-details/task-details.page').then(m => m.TaskDetailsPage)
      },
      {
        path: '',
        // Si el usuario va a /tabs sin sub-ruta, redirigir a dashboard (ruta relativa)
        redirectTo: 'dashboard', 
        pathMatch: 'full',
      },
    ],
  },
  // Si el usuario intenta ir a una ruta que no existe (ej: /cosa-rara)
  {
    path: '**', 
    redirectTo: 'login',
    pathMatch: 'full'
  }
];