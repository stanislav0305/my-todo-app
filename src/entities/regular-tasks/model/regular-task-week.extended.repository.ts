import { mapper } from '@entities/regular-tasks/mapper'
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { RegularTaskWeek } from '../types/regular-task-week.entity'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import type { RegularTaskExtendedRepository } from './regular-task.extended.repository'


export interface RegularTaskWeekExtendedRepository extends Repository<RegularTaskWeek> {
    createRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek>
    updateRegTaskWeek(regularTaskRep: RegularTaskExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined): Promise<RegularTaskWeek>
    softRemoveRegTaskWeek(id: number): Promise<[RegularTaskWeek, number[]]>
    removeRegTaskWeek(id: number): Promise<[RegularTaskWeek, number[]]>
    recoverRegTaskWeek(id: number): Promise<[RegularTaskWeek, number[]]>
    findOneRegTaskWeek(id: number, withDeleted: boolean | undefined): Promise<RegularTaskWeek | null>
}

export const regularTaskWeekExtendedRepository: RegularTaskWeekExtendedRepository = {
    async createRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek> {
        let rtw = this.create()
        rtw.weekDays = []
        model.su && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 0 } }))
        model.mo && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 1 } }))
        model.tu && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 2 } }))
        model.we && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 3 } }))
        model.th && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 4 } }))
        model.fr && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 5 } }))
        model.sa && rtw.weekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: 6 } }))

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

            let newWeekDays: RegularTask[] = []
            newWeekDays = mapper.mapToEntityWeekDay(model.su, 0, model, oldWeekDays, newWeekDays)
            newWeekDays = mapper.mapToEntityWeekDay(model.mo, 1, model, oldWeekDays, newWeekDays)
            newWeekDays = mapper.mapToEntityWeekDay(model.tu, 2, model, oldWeekDays, newWeekDays)
            newWeekDays = mapper.mapToEntityWeekDay(model.we, 3, model, oldWeekDays, newWeekDays)
            newWeekDays = mapper.mapToEntityWeekDay(model.th, 4, model, oldWeekDays, newWeekDays)
            newWeekDays = mapper.mapToEntityWeekDay(model.fr, 5, model, oldWeekDays, newWeekDays)
            newWeekDays = mapper.mapToEntityWeekDay(model.sa, 6, model, oldWeekDays, newWeekDays)

            rtw.weekDays = newWeekDays
            result = await this.save(rtw)
        } else {
            //convert daily, monthly or yearly regular task to week regular task
            regularTaskRep.removeRegTask(model.id)
            result = await this.createRegTaskWeek(model)
        }

        return result
    },

    async softRemoveRegTaskWeek(id: number): Promise<[RegularTaskWeek, number[]]> {
        //can remove only not soft deleted
        const taskToRemove = (await this.findOneRegTaskWeek(id, false))!
        const regTaskIds = taskToRemove.weekDays.map(i => i.id)

        const regTaskWeek = await this.softRemove(taskToRemove!)

        return [regTaskWeek, regTaskIds]
    },

    async removeRegTaskWeek(id: number): Promise<[RegularTaskWeek, number[]]> {
        //can remove only soft deleted
        //need restore week
        let [taskForRemove, regTaskIds] = await this.recoverRegTaskWeek(id)

        //remove days of week
        taskForRemove.weekDays = []
        taskForRemove = await this.save(taskForRemove)

        //remove week
        const regTaskWeek = await this.remove(taskForRemove)
        return [regTaskWeek, regTaskIds]
    },

    async recoverRegTaskWeek(id: number): Promise<[RegularTaskWeek, number[]]> {
        //can restore soft deleted and not
        const taskToRemove = (await this.findOneRegTaskWeek(id, true))!
        const regTaskIds = taskToRemove.weekDays.map(i => i.id)

        const regTaskWeek: RegularTaskWeek = await this.recover(taskToRemove)

        return [regTaskWeek, regTaskIds]
    },

    async findOneRegTaskWeek(id: number, withDeleted: boolean | undefined): Promise<RegularTaskWeek | null> {
        const rtw = await this.findOne({
            where: { id } as FindOptionsWhere<RegularTaskWeek>,
            withDeleted: withDeleted,
            relations: { weekDays: true },
        } as FindOneOptions<RegularTaskWeek>)

        return rtw
    }
} as RegularTaskWeekExtendedRepository satisfies RegularTaskWeekExtendedRepository