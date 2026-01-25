
import { RegularTasksFilterModeType } from "./regular-tasks-filter-mode-type"


export interface RegularTasksFilter {
    mode: RegularTasksFilterModeType
    withDeleted?: boolean | undefined
    id?: number | undefined
    time?: string
    beginDate0?: string
    beginDate1?: string
    endDate0?: string
    endDate1?: string
    title?: string
    isImportant?: boolean
    isUrgent?: boolean
}