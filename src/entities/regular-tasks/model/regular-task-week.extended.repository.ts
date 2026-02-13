import { mapper } from '@entities/regular-tasks/mapper'
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { RegularTaskWeek } from '../types/regular-task-week.entity'
import { RegularTaskModel } from '../types/regular-task.model'


export interface RegularTaskWeekExtendedRepository extends Repository<RegularTaskWeek> {
    createRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek>
    updateRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek>
    removeRegTaskWeek(id: number, softRemove: boolean): Promise<[RegularTaskWeek, number[]]>
    findOneRegTaskWeek(id: number, withDeleted: boolean): Promise<RegularTaskWeek>
}

export const regularTaskWeekExtendedRepository: RegularTaskWeekExtendedRepository = {
    async createRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek> {

        let rtw = new RegularTaskWeek()
        rtw = {
            su: model.su ? mapper.mapToEntity({ model, weekDay: 0 }) : null,
            mo: model.mo ? mapper.mapToEntity({ model, weekDay: 1 }) : null,
            tu: model.tu ? mapper.mapToEntity({ model, weekDay: 2 }) : null,
            we: model.we ? mapper.mapToEntity({ model, weekDay: 3 }) : null,
            th: model.th ? mapper.mapToEntity({ model, weekDay: 4 }) : null,
            fr: model.fr ? mapper.mapToEntity({ model, weekDay: 5 }) : null,
            sa: model.sa ? mapper.mapToEntity({ model, weekDay: 6 }) : null
        } as RegularTaskWeek

        return await this.save(rtw)
    },
    async updateRegTaskWeek(model: RegularTaskModel): Promise<RegularTaskWeek> {
        let rtw = await this.findOneRegTaskWeek(model.regularTaskWeekId!, false)

        rtw = {
            ...rtw,
            su: mapper.mapToEntityWeekDay(model.su, 0, model, rtw.su),
            mo: mapper.mapToEntityWeekDay(model.mo, 1, model, rtw.mo),
            tu: mapper.mapToEntityWeekDay(model.tu, 2, model, rtw.tu),
            we: mapper.mapToEntityWeekDay(model.we, 3, model, rtw.we),
            th: mapper.mapToEntityWeekDay(model.th, 4, model, rtw.th),
            fr: mapper.mapToEntityWeekDay(model.fr, 5, model, rtw.fr),
            sa: mapper.mapToEntityWeekDay(model.sa, 6, model, rtw.sa),
        } as RegularTaskWeek

        const regTaskWeek = await this.save(rtw)
        return regTaskWeek
    },

    async removeRegTaskWeek(id: number, softRemove: boolean): Promise<[RegularTaskWeek, number[]]> {
        const taskToRemove = await this.findOneRegTaskWeek(id, softRemove)

        let regTaskIds: number[] = mapper.mapToIds(taskToRemove)

        const regTaskWeek: RegularTaskWeek = softRemove
            ? await this.softRemove(taskToRemove!)
            : await this.remove(taskToRemove!)

        const result: [RegularTaskWeek, number[]] = [regTaskWeek, regTaskIds]
        return result
    },

    async findOneRegTaskWeek(id: number, withDeleted: boolean): Promise<RegularTaskWeek> {
        const taskToRemove = (await this.findOne({
            where: { id } as FindOptionsWhere<RegularTaskWeek>,
            withDeleted: withDeleted,
            relations: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
        } as FindOneOptions<RegularTaskWeek>))!

        return taskToRemove
    }
} as RegularTaskWeekExtendedRepository satisfies RegularTaskWeekExtendedRepository