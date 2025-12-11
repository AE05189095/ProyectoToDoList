import { Pipe, PipeTransform } from '@angular/core';
// ************ CORRECCIÓN DE RUTA ************
// Desde `src/pipes/` la ruta correcta a la interfaz está en `src/app/interfaces/`
import { Task } from '../app/interfaces/task.interface';

@Pipe({
    name: 'filterTasks',
    standalone: true // Es un Pipe standalone
})
export class FilterTasksPipe implements PipeTransform {

    transform(tasks: Task[] | null, filterType: string, hideCompleted: boolean = false): Task[] {
        if (!tasks) {
            return [];
        }

        let filteredTasks = tasks;

        // 1. Filtrar por Tipo (si filterType no es 'all')
        if (filterType && filterType !== 'all') {
            // Normalizamos a minúsculas para asegurar la comparación
            filteredTasks = filteredTasks.filter(task =>
                task.type.toLowerCase() === filterType.toLowerCase()
            );
        }

        // 2. Ocultar Completadas (si hideCompleted es true)
        if (hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        }

        return filteredTasks;
    }
}