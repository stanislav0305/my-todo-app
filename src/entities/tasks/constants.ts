import { DbFilter } from '@/src/shared/lib/types'
import { Task } from './types/task'
import { TaskColumnsShow } from './types/task-columns-show'
import { TasksFilterModeType } from './types/tasks-filter-mode-type'
import { TaskPaging } from './types/tasks-paging'
import { TasksState } from './types/tasks-state'

export const TASK_TAKE_ITEMS_COUNT = 20

export const DEFAULT_TASK = {
    id: 0,
    title: '',
    time: '',
    date: '',
    status: 'todo',
    isImportant: false,
    isUrgent: false,
} as Task

export const DEFAULT_TASK_COLUMNS_SHOW = {
    id: false,
    date: false,
    createdAt: false,
    updateAt: false,
    deletedAt: false,
} as TaskColumnsShow

export const DEFAULT_TASK_PAGING = {
    fetchType: 'fetchFromBegin',
    itemCount: 0,
    skip: 0,
    take: TASK_TAKE_ITEMS_COUNT,
    hasNext: true,
    hasPrevious: false,
    filter: {
        mode: 'all',
        count: 0,
        withDeleted: undefined,
        where: undefined,
    } as DbFilter<Task, TasksFilterModeType>,
    columnsShow: { ...DEFAULT_TASK_COLUMNS_SHOW },
    order: { date: 'ASC', time: 'ASC' },
} as TaskPaging

export const INITIAL_TASKS_STATE = {
    paging: Object.assign({}, DEFAULT_TASK_PAGING),
    items: [] as Task[],
} satisfies TasksState as TasksState

export const taskStatusIconNames = {
    todo: 'checkbox-blank-circle-outline',
    doing: 'progress-clock',
    done: 'check-circle-outline',
}
