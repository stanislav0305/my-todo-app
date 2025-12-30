import { FindOptionsOrder, FindOptionsWhere } from "typeorm";


export interface Paging<T> {
    itemCount: number
    skip: number,
    take: number
    hasNext: boolean
    hasPrevious: boolean
    where: FindOptionsWhere<T> | undefined
    order: FindOptionsOrder<T> | undefined
}