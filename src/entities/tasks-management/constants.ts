import { Task } from './types/task'
import { TasksState } from './types/tasks-state'


export const DEFAULT_TASK = {
    id: 0,
    title: '',
    time: '',
    date: '',
    status: 'todo'
} satisfies Task

export const INITIAL_TASKS_STATE = {
    tasks: [] as Task[],
} satisfies TasksState as TasksState

export const taskStatusIconNames = {
    todo: 'checkbox-blank-circle-outline',
    doing: 'progress-clock',
    done: 'check-circle-outline'
}