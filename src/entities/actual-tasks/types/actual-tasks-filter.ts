import { ActualTasksFilterModeType } from "./actual-tasks-filter-mode-type"


export interface ActualTasksFilter {
    mode: ActualTasksFilterModeType
    withDeleted?: boolean | undefined
    id?: string | undefined
    time?: string
    Date0?: string
    Date1?: string
    title?: string
    isImportant?: boolean
    isUrgent?: boolean
}