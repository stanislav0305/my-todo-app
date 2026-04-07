import { mapper } from '@entities/regular-tasks/mapper'
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { RegularTaskWeek } from '../types/regular-task-week.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import type { RegularTaskExtendedRepository } from './regular-task.extended.repository'


export interface RegularTaskWeekExtendedRepository extends Repository<RegularTaskWeek> {
    createRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek>
    updateRegTaskWeek(regularTaskRep: RegularTaskExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined): Promise<RegularTaskWeek>
    softRemoveRegTaskWeek(weekId: number): Promise<[RegularTaskWeek, number[]]>
    removeRegTaskWeek(weekId: number): Promise<[RegularTaskWeek, number[]]>
    recoverRegTaskWeek(weekId: number): Promise<[RegularTaskWeek, number[]]>
    findOneRegTaskWeek(weekId: number, withDeleted: boolean | undefined): Promise<RegularTaskWeek | null>
}

export const regularTaskWeekExtendedRepository: RegularTaskWeekExtendedRepository = {
    async createRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek> {
        let rtw = this.create()

        rtw.beginDate = model.beginDate
        rtw.weekDays = []

        rtw.weekDays = mapper.mapToEntityWeekDay(model.su, 0, model, [], rtw.weekDays)
        rtw.weekDays = mapper.mapToEntityWeekDay(model.mo, 1, model, [], rtw.weekDays)
        rtw.weekDays = mapper.mapToEntityWeekDay(model.tu, 2, model, [], rtw.weekDays)
        rtw.weekDays = mapper.mapToEntityWeekDay(model.we, 3, model, [], rtw.weekDays)
        rtw.weekDays = mapper.mapToEntityWeekDay(model.th, 4, model, [], rtw.weekDays)
        rtw.weekDays = mapper.mapToEntityWeekDay(model.fr, 5, model, [], rtw.weekDays)
        rtw.weekDays = mapper.mapToEntityWeekDay(model.sa, 6, model, [], rtw.weekDays)

        //console.log('createRegTaskWeek data to save:', JSON.stringify(rtw, null, 2))
        return await this.save(rtw, { transaction: true })
    },
    async updateRegTaskWeek(regularTaskRep: RegularTaskExtendedRepository, model: RegularTaskModel,
        oldWeekId: number | null | undefined): Promise<RegularTaskWeek> {
        //can't update soft deleted
        let result: RegularTaskWeek

        if (!!oldWeekId) {
            //update week
            let rtw = (await this.findOneRegTaskWeek(model.weekId!, false))!
            const oldWeekDays = [...rtw.weekDays]

            rtw.beginDate = model.beginDate
            rtw.weekDays = []
            rtw.weekDays = mapper.mapToEntityWeekDay(model.su, 0, model, oldWeekDays, rtw.weekDays)
            rtw.weekDays = mapper.mapToEntityWeekDay(model.mo, 1, model, oldWeekDays, rtw.weekDays)
            rtw.weekDays = mapper.mapToEntityWeekDay(model.tu, 2, model, oldWeekDays, rtw.weekDays)
            rtw.weekDays = mapper.mapToEntityWeekDay(model.we, 3, model, oldWeekDays, rtw.weekDays)
            rtw.weekDays = mapper.mapToEntityWeekDay(model.th, 4, model, oldWeekDays, rtw.weekDays)
            rtw.weekDays = mapper.mapToEntityWeekDay(model.fr, 5, model, oldWeekDays, rtw.weekDays)
            rtw.weekDays = mapper.mapToEntityWeekDay(model.sa, 6, model, oldWeekDays, rtw.weekDays)

            //console.log('updateRegTaskWeek data to save:', JSON.stringify(rtw, null, 2))
            result = await this.save(rtw)
        } else {
            //convert daily, monthly or yearly regular task to week regular task
            console.log(`updateRegTaskWeek: weekly regular task well be removed by id:${model.id} and crated 
                (convert daily, monthly or yearly regular task to week regular task)`)
            regularTaskRep.removeRegTask(model.id)
            result = await this.createRegTaskWeek(model)
        }

        return result
    },

    async softRemoveRegTaskWeek(weekId: number): Promise<[RegularTaskWeek, number[]]> {
        //can remove only not soft deleted
        const taskToRemove = (await this.findOneRegTaskWeek(weekId, false))!
        const regTaskIds = taskToRemove.weekDays.map(i => i.id)

        const regTaskWeek = await this.softRemove(taskToRemove!)

        return [regTaskWeek, regTaskIds]
    },

    async removeRegTaskWeek(weekId: number): Promise<[RegularTaskWeek, number[]]> {
        //can remove only soft deleted
        //need restore week
        let [taskForRemove, regTaskIds] = await this.recoverRegTaskWeek(weekId)
        //console.log(`removeRegTaskWeek: taskForRemove:${JSON.stringify(taskForRemove, null, 2)}, regTaskIds:${regTaskIds}`)

        //remove days of week
        taskForRemove.weekDays = []
        taskForRemove = await this.save(taskForRemove)

        //remove week
        const regTaskWeek = await this.remove(taskForRemove)
        //console.log(`Removed: regTaskWeek:${JSON.stringify(regTaskWeek, null, 2)}`)

        return [regTaskWeek, regTaskIds]
    },

    async recoverRegTaskWeek(weekId: number): Promise<[RegularTaskWeek, number[]]> {
        //can restore soft deleted and not
        const taskToRemove = (await this.findOneRegTaskWeek(weekId, true))!
        const regTaskIds = taskToRemove.weekDays.map(i => i.id)

        const regTaskWeek: RegularTaskWeek = await this.recover(taskToRemove)

        return [regTaskWeek, regTaskIds]
    },

    async findOneRegTaskWeek(weekId: number, withDeleted: boolean | undefined): Promise<RegularTaskWeek | null> {
        const rtw = await this.findOne({
            where: { id: weekId } as FindOptionsWhere<RegularTaskWeek>,
            withDeleted: withDeleted,
            relations: { weekDays: true },
        } as FindOneOptions<RegularTaskWeek>)

        return rtw
    }
} as RegularTaskWeekExtendedRepository satisfies RegularTaskWeekExtendedRepository