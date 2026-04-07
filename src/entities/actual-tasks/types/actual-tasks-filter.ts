import { ActualTasksFilterModeType } from "./actual-tasks-filter-mode-type"


export interface ActualTasksFilter {
    mode: ActualTasksFilterModeType
    withDeleted?: boolean | undefined
    id?: string | undefined
    time?: string
    date0?: string
    date1?: string
    title?: string
    isImportant?: boolean
    isUrgent?: boolean
}