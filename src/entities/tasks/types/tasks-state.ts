import { Paging } from '@shared/lib/types';
import { Task } from './task';


export interface TasksState {
    paging: Paging<Task>,
    items: Task[],
}