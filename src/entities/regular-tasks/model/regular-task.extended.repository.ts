import { mapper } from '@entities/regular-tasks/mapper'
import { FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import type { RegularTaskWeekExtendedRepository } from './regular-task-week.extended.repository'


export interface RegularTaskExtendedRepository extends Repository<RegularTask> {
    createRegTask(model: RegularTaskModel): Promise<RegularTaskModel>
    updateRegTask(regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined): Promise<[boolean, RegularTaskModel]>
    softRemoveRegTask(id: number): Promise<RegularTask>
    removeRegTask(id: number): Promise<RegularTask>
    restoreRegTask(id: number): Promise<UpdateResult>
    findOneRegTask(id: number, withDeleted?: boolean): Promise<RegularTask>
    findOneRegTaskWithWeekDays(id: number, withDeleted?: boolean): Promise<RegularTask>
}

export const regularTaskExtendedRepository: RegularTaskExtendedRepository = {
    async createRegTask(model: RegularTaskModel): Promise<RegularTaskModel> {
        //create daily, monthly or yearly reg task
        const rt = mapper.mapToEntity({ model })

        //console.log('createRegTask data to save:', JSON.stringify(rt, null, 2))
        const result = await this.save(rt)
        return mapper.mapToModel(result)
    },

    async updateRegTask(regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel,
        oldWeekId: number | null | undefined): Promise<[boolean, RegularTaskModel]> {
        //can't update soft deleted
        let result: RegularTaskModel

        let rt = await this.findOneBy({ id: model.id })
        const needReload = rt == null
            || !model.id || model.time !== model.time || rt.beginDate !== model.beginDate
            || rt.endDate !== model.endDate
            || (!!rt.id && rt.period === 'everyWeek')
            || (!!rt.id && (rt.period === 'everyWeek' || model.period === 'everyWeek') && rt.period !== model.period)


        if (!!oldWeekId) {
            //convert week regular task to daily, monthly or yearly regular task 
            console.log(`updateRegTask: daily, monthly or yearly regular task well be removed by id:${oldWeekId} and crated 
                (convert week regular task to daily, monthly or yearly regular task )`)
            await regularTaskWeekRep.removeRegTaskWeek(oldWeekId)
            result = await this.createRegTask(model)
        } else {
            //update daily, monthly and yearly regular task
            let rt = (await this.findOne({ where: { id: model.id }, withDeleted: false }))!

            rt = mapper.mapToEntity({ model, rt })

            //console.log('updateRegTask data to save:', JSON.stringify(rt, null, 2))
            rt = await this.save(rt)
            result = mapper.mapToModel(rt)
        }

        return [needReload, result]
    },

    async softRemoveRegTask(id: number): Promise<RegularTask> {
        //can remove only not soft removed
        const taskToRemove = await this.findOneRegTask(id, false)
        return await this.softRemove(taskToRemove)
    },

    async removeRegTask(id: number): Promise<RegularTask> {
        //can remove soft removed and not
        const taskToRemove = await this.findOneRegTask(id, true)
        return await this.remove(taskToRemove)
    },

    async restoreRegTask(id: number): Promise<UpdateResult> {
        return await this.restore(id)
    },

    async findOneRegTask(id: number, withDeleted?: boolean): Promise<RegularTask> {
        const rt = (await this.findOne({
            where: { id } as FindOptionsWhere<RegularTask>,
            withDeleted: withDeleted,
            relations: { week: true },
        } as FindOneOptions<RegularTask>))!

        //console.log('findOneRegTask result:', JSON.stringify(rt, null, 2))
        return rt
    },

    async findOneRegTaskWithWeekDays(id: number, withDeleted?: boolean): Promise<RegularTask> {
        const rt = (await this.findOne({
            where: { id } as FindOptionsWhere<RegularTask>,
            withDeleted: withDeleted,
            relations: {
                week: {
                    weekDays: true
                }
            },
        } as FindOneOptions<RegularTask>))!

        //console.log(`findOneRegTaskWithWeekDays(id: ${id}, withDeleted: ${withDeleted}) result:`, JSON.stringify(rt, null, 2))
        return rt
    }


} as RegularTaskExtendedRepository satisfies RegularTaskExtendedRepository