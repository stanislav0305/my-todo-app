import { Task } from './task'
import { TaskPaging } from './tasks-paging'


export interface TasksState {
    paging: TaskPaging,
    items: Task[],
}