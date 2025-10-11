import { Task } from './types/task'
import { Tasks } from './types/tasks'
import { TasksState } from './types/tasks-state'


export const DEFAULT_TASK = {
    key: '',
    title: '',
} satisfies Task

export const INITIAL_TASKS_STATE = {
    tasks: {} satisfies Tasks
} satisfies TasksState as TasksState