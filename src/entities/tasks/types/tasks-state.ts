import { Task } from './task.entity'
import { TaskPaging } from './tasks-paging'


export interface TasksState {
    paging: TaskPaging
    items: Task[]
    currentItem: Task
}