import { mapper } from '@entities/regular-tasks/mapper'
import { dateHelper } from '@shared/lib/helpers'
import { FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import type { RegularTaskWeekExtendedRepository } from './regular-task-week.extended.repository'


export interface RegularTaskExtendedRepository extends Repository<RegularTask> {
    findByPeriod(from: Date, to: Date): Promise<RegularTask[]>

    createRegTask(model: RegularTaskModel): Promise<RegularTaskModel>
    updateRegTask(regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined): Promise<RegularTaskModel>
    softRemoveRegTask(id: number): Promise<RegularTask>
    removeRegTask(id: number): Promise<RegularTask>
    restoreRegTask(id: number): Promise<UpdateResult>
    findOneRegTask(id: number, withDeleted: boolean | undefined): Promise<RegularTask>
}

export const regularTaskExtendedRepository: RegularTaskExtendedRepository = {
    findByPeriod(this: Repository<RegularTask>, from: Date, to: Date): Promise<RegularTask[]> {
        /*
        const { regularTaskRep } = { ...this.props }
                regularTaskRep
                    .findByPeriod(
                        dateHelper.dbStrDateToDate('2026-01-24'),
                        dateHelper.dbStrDateToDate('2027-03-25')
                    )
                    .then(values => {
                        console.log('FIND_BY_PERIOD', values.length)
                        return values
                    })
        
        */
        return this.query(`
            WITH RECURSIVE dates(isFirst, date,
                weekDayName, weekDay,
                periodParam,
                id, 
                time, period, periodSize, su, mo, tu, we, th, fr, sa, title, 
                isImportant, isUrgent, createdAt, updateAt, deletedAt, beginDate, endDate) 
            AS (
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'su' AS weekDayName, 0 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 0) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.su = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'mo' AS weekDayName, 1 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 1) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.mo = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'tu' AS weekDayName, 2 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 2) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.tu = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'we' AS weekDayName, 3 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 3) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.we = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'th' AS weekDayName, 4 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 4) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.th = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'fr' AS weekDayName, 5 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 5) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.fr = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT 
                    'true ' || 'everyWeek' as isFirst, rt.beginDate as date,
                    'sa' AS weekDayName, 6 as weekDay,
                    '+' || (periodSize * 7 - strftime('%w', beginDate) + 6) || ' day' as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND rt.period='everyWeek' AND rt.sa = true
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT
                    'true ' || rt.period as isFirst, rt.beginDate as date,
                    NULL AS weekDayName, NULL as weekDay,
                    CASE
                        WHEN rt.period = 'everyDay'
                            THEN '+' || rt.periodSize || ' day'
                        WHEN rt.period = 'everyMonth'
                            THEN '+' || rt.periodSize || ' month'
                        WHEN rt.period = 'everyYear'
                            THEN '+' || rt.periodSize || ' year'
                    END as periodParam,
                    rt.* 
                FROM regularTasks as rt
                WHERE 
                    rt.deletedAt is null AND (rt.period='everyDay' OR  rt.period='everyMonth' OR rt.period='everyYear')
                    AND NOT ((rt.beginDate < $1 AND rt.endDate is not null AND rt.endDate < $1)
                    OR ($2 < rt.beginDate  AND rt.endDate is not null AND $2 < rt.endDate)
                    OR ($2 < rt.beginDate  AND rt.endDate is null))
                UNION ALL
                SELECT
                    'false ' || d.period as isFirst, date(d.date, d.periodParam) as date,
                    d.weekDayName, d.weekDay,
                    d.periodParam,

                    d.id, 
                    d.time, d.period, d.periodSize, d.su, d.mo, d.tu, d.we, d.th, d.fr, d.sa, d.title, 
                    d.isImportant, d.isUrgent, d.createdAt, d.updateAt, d.deletedAt, d.beginDate, d.endDate

                FROM dates d
                WHERE
                    date(d.date, d.periodParam) >= d.beginDate
                    AND (d.endDate is null OR date(d.date, d.periodParam) <= d.endDate)
                    AND date(d.date, d.periodParam) < $2
                    order by date, period, id	
            )

            SELECT * FROM dates WHERE (date >= $1)
            `,
            /* with exclude rows what enter to period but begins later */
            [
                dateHelper.toFormattedString(from, 'YYYY-MM-DD'),
                dateHelper.toFormattedString(to, 'YYYY-MM-DD')
            ])
    },

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