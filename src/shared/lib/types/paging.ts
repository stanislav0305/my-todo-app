import { FindOptionsOrder } from 'typeorm'
import { DbFilter } from './db-filter'

export type FetchTasksTypes = 'fetchFromBegin' | 'fetchNext'

export interface Paging<T, M, CS> {
    fetchType: FetchTasksTypes
    itemCount: number
    skip: number
    take: number
    hasNext: boolean
    hasPrevious: boolean
    filter: DbFilter<T, M>
    columnsShow: CS
    order: FindOptionsOrder<T> | undefined
}