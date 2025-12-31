import { Paging } from '@/src/shared/lib/types/paging'
import { Task } from './types/task'
import { TasksState } from './types/tasks-state'


export const TASK_TAKE_ITEMS_COUNT = 10

export const DEFAULT_TASK = {
    id: 0,
    title: '',
    time: '',
    date: '',
    status: 'todo',
    isImportant: false,
    isUrgent: false
} as Task

const DEFAULT_TASK_PAGING = {
    itemCount: 0,
    skip: TASK_TAKE_ITEMS_COUNT * (-1),
    take: TASK_TAKE_ITEMS_COUNT,
    hasNext: true,
    hasPrevious: false,
    order: { date: 'ASC', time: 'ASC' },
    where: undefined,
} as Paging<Task>

export const INITIAL_TASKS_STATE = {
    paging: DEFAULT_TASK_PAGING,
    items: [] as Task[],
} satisfies TasksState as TasksState

export const taskStatusIconNames = {
    todo: 'checkbox-blank-circle-outline',
    doing: 'progress-clock',
    done: 'check-circle-outline'
}