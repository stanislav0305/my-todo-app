import { Task } from './types/task'
import { Tasks } from './types/tasks'
import { TasksState } from './types/tasks-state'


export const DEFAULT_TASK = {
    key: '',
    title: '',
    time: '',
    date: '',
    status: 'todo'
} satisfies Task

export const INITIAL_TASKS_STATE = {
    tasks: {} satisfies Tasks
} satisfies TasksState as TasksState

export const taskStatusIconNames = {
    todo: 'checkbox-blank-circle-outline',
    doing: 'progress-clock',
    done: 'check-circle-outline'
}