import { TaskStatus } from './task'
import { TasksFilterModeType } from './tasks-filter-mode-type'

export interface TasksFilter {
    mode: TasksFilterModeType
    withDeleted: boolean
    date0?: string
    date1?: string
    id?: number | undefined
    time?: string
    title?: string
    status?: TaskStatus
    isImportant?: boolean
    isUrgent?: boolean
}
