import { FindOptionsWhere } from "typeorm"


export interface DbFilter<T, M> {
    mode: M
    count: number
    withDeleted?: boolean | undefined
    where: FindOptionsWhere<T> | undefined
}