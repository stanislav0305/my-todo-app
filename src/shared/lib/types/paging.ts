import { FindOptionsOrder, FindOptionsWhere } from "typeorm";

export type FetchTasksTypes = 'fetchFromBegin' | 'fetchNext' | 'fetchFromBeginToSkipped'

export interface Paging<T> {
    fetchType: FetchTasksTypes
    itemCount: number
    skip: number
    take: number
    hasNext: boolean
    hasPrevious: boolean
    where: FindOptionsWhere<T> | undefined
    order: FindOptionsOrder<T> | undefined
}