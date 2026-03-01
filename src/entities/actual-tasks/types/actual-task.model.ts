import { ActualTaskPeriod, ActualTaskStatus } from './actual-task-view.entity'


export class ActualTaskModel {
    id: string

    isFirstGen: string

    time: string
    date: string

    title: string

    regularTaskId: number | null
    taskId: number | null
    regularTasksResultId: number | null

    weekDay: number | null
    periodParam: string
    period: ActualTaskPeriod | null
    periodSize: number | null

    isImportant: boolean
    isUrgent: boolean

    createdAt: string
    updateAt: string
    deletedAt: string | null

    beginDate: string | null
    endDate: string | null

    status: ActualTaskStatus

    pagingDateFrom: string | null
    pagingDateTo: string | null
}