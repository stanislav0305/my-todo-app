import { ActualTaskDatesPeriod } from './actual-task-paging.entity'


export type ActualTaskPagingPeriodModel = {
    id: number
    dateFrom: string
    dateTo: string
    period: ActualTaskDatesPeriod
}