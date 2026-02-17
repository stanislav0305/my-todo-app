import { Period } from './regular-task.entity'

export class RegularTaskModel {
    id: number
    time: string
    beginDate: string
    endDate: string | null
    period: Period
    periodParam: string
    periodSize: number
    weekDay: number | null
    title: string
    isImportant: boolean
    isUrgent: boolean

    createdAt: string
    updateAt: string
    deletedAt: string | null

    weekId?: number | null | undefined
    su: boolean
    mo: boolean
    tu: boolean
    we: boolean
    th: boolean
    fr: boolean
    sa: boolean
}