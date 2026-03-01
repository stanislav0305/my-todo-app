import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { RegularTaskResult } from '../types/regular-task-result.entity'


export interface RegularTaskResultExtendedRepository extends Repository<RegularTaskResult> {
    createRegTaskResult(item: RegularTaskResult): Promise<RegularTaskResult>
    updateRegTaskResult(item: RegularTaskResult): Promise<RegularTaskResult>
    softRemoveRegTaskResult(id: number): Promise<RegularTaskResult>
    removeRegTaskResult(id: number): Promise<RegularTaskResult>
    recoverRegTaskResult(id: number): Promise<RegularTaskResult>
    findOneRegTaskResult(id: number, withDeleted: boolean | undefined): Promise<RegularTaskResult | null>
}

export const regularTaskResultExtendedRepository: RegularTaskResultExtendedRepository = {
    async createRegTaskResult(item: RegularTaskResult): Promise<RegularTaskResult> {
        return await this.save({ ...item })
    },

    async updateRegTaskResult(item: RegularTaskResult): Promise<RegularTaskResult> {
        //can't update soft deleted
        let r = (await this.findOneRegTaskResult(item.id, false))!
        r = {
            ...r,
            ...item
        }

        const result = await this.save(r)
        return result
    },

    async softRemoveRegTaskResult(id: number): Promise<RegularTaskResult> {
        //can remove only not soft deleted
        const itemToRemove = (await this.findOneRegTaskResult(id, false))!
        const r = await this.softRemove(itemToRemove!)
        return r
    },

    async removeRegTaskResult(id: number): Promise<RegularTaskResult> {
        //can remove only soft deleted
        //need restore
        let itemForRemove = await this.recoverRegTaskResult(id)

        //remove
        const removedItem = await this.remove(itemForRemove)
        return removedItem
    },

    async recoverRegTaskResult(id: number): Promise<RegularTaskResult> {
        //can restore soft deleted and not
        const itemToRecovery = (await this.findOneRegTaskResult(id, true))!
        const recoveredItem = await this.recover(itemToRecovery)
        return recoveredItem
    },

    async findOneRegTaskResult(id: number, withDeleted: boolean | undefined): Promise<RegularTaskResult | null> {
        const r = await this.findOne({
            where: { id } as FindOptionsWhere<RegularTaskResult>,
            withDeleted: withDeleted
        } as FindOneOptions<RegularTaskResult>)

        return r
    },
} as RegularTaskResultExtendedRepository satisfies RegularTaskResultExtendedRepository