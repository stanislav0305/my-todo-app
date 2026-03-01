import { mapper } from '@entities/regular-tasks/mapper'
import { FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import type { RegularTaskWeekExtendedRepository } from './regular-task-week.extended.repository'


export interface RegularTaskExtendedRepository extends Repository<RegularTask> {
    createRegTask(model: RegularTaskModel): Promise<RegularTaskModel>
    updateRegTask(regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined): Promise<RegularTaskModel>
    softRemoveRegTask(id: number): Promise<RegularTask>
    removeRegTask(id: number): Promise<RegularTask>
    restoreRegTask(id: number): Promise<UpdateResult>
    findOneRegTask(id: number, withDeleted: boolean | undefined): Promise<RegularTask>
}

export const regularTaskExtendedRepository: RegularTaskExtendedRepository = {
    async createRegTask(model: RegularTaskModel): Promise<RegularTaskModel> {
        const rt = mapper.mapToEntity({ model })
        const result = await this.save(rt)
        return mapper.mapToModel(result)
    },

    async updateRegTask(regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel,
        oldWeekId: number | null | undefined): Promise<RegularTaskModel> {
        //can't update soft deleted
        let result: RegularTaskModel

        if (!!oldWeekId) {
            //convert week regular task to daily, monthly or yearly regular task 
            await regularTaskWeekRep.removeRegTaskWeek(oldWeekId)
            result = await this.createRegTask(model)
        } else {
            //update daily, monthly and yearly regular task
            let rt = (await this.findOne({ where: { id: model.id }, withDeleted: false }))!

            rt = mapper.mapToEntity({ model, rt })
            rt = await this.save(rt)
            result = mapper.mapToModel(rt)
        }

        return result
    },

    async softRemoveRegTask(id: number): Promise<RegularTask> {
        //can remove only not soft deleted
        const taskToRemove = await this.findOneRegTask(id, false)
        return await this.softRemove(taskToRemove)
    },

    async removeRegTask(id: number): Promise<RegularTask> {
        //can remove soft deleted and not
        const taskToRemove = await this.findOneRegTask(id, true)
        return await this.remove(taskToRemove)
    },

    async restoreRegTask(id: number): Promise<UpdateResult> {
        return await this.restore(id)
    },

    async findOneRegTask(id: number, withDeleted: boolean | undefined): Promise<RegularTask> {
        const rt = (await this.findOne({
            where: { id } as FindOptionsWhere<RegularTask>,
            withDeleted: withDeleted,
            relations: { week: true },
        } as FindOneOptions<RegularTask>))!

        return rt
    }
} as RegularTaskExtendedRepository satisfies RegularTaskExtendedRepository