import { Repository } from 'typeorm'
import { ActualTaskPaging } from '../types/actual-task-paging.entity'


export interface ActualTaskPagingExtendedRepository extends Repository<ActualTaskPaging> {
    getTopOne(this: Repository<ActualTaskPaging>): Promise<ActualTaskPaging>
    updateTopOne(this: Repository<ActualTaskPaging>, item: ActualTaskPaging): Promise<ActualTaskPaging>
}

export const actualTaskPagingExtendedRepository: ActualTaskPagingExtendedRepository = {
    async getTopOne(this: Repository<ActualTaskPaging>): Promise<ActualTaskPaging> {
        const p = (await this.find({ order: { id: 'DESC' }, take: 1 })!)[0]
        return p
    },
    async updateTopOne(this: Repository<ActualTaskPaging>, item: ActualTaskPaging): Promise<ActualTaskPaging> {
        let t = (await this.find({ order: { id: 'DESC' }, take: 1 })!)[0]
        t = {
            ...t,
            ...item,
        }

        return await this.save(t)
    },
} as ActualTaskPagingExtendedRepository satisfies ActualTaskPagingExtendedRepository