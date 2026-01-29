import { dateHelper } from '@shared/lib/helpers'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { REGULAR_TASK_TAKE_ITEMS_COUNT } from '../constants'
import { RegularTask } from '../types/regular-task'
import { RegularTaskColumnsShow } from '../types/regular-task-columns-show'
import { RegularTasksFilterModeType } from '../types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from '../types/regular-tasks-paging'


export interface RegularTaskExtendedRepository extends Repository<RegularTask> {
    mapPagingBefore(paging: RegularTaskPaging, fetchType: FetchTasksTypes, columnsShow: RegularTaskColumnsShow | null,
        filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null): { paging: RegularTaskPaging, hasNext: boolean }
    mapPagingAfter(paging: RegularTaskPaging, itemCount: number): RegularTaskPaging
    fetchRegTasks(paging: RegularTaskPaging): Promise<[RegularTask[], number]>
    findByPeriod(from: Date, to: Date): Promise<RegularTask[]>
    createRegTask(this: Repository<RegularTask>, item: RegularTask): Promise<RegularTask>
    updateRegTask(this: Repository<RegularTask>, item: RegularTask): Promise<RegularTask>
    removeRegTask(this: Repository<RegularTask>, id: number, softRemove: boolean): Promise<RegularTask>
}

export const regularTaskExtendedRepository: RegularTaskExtendedRepository = {
    mapPagingBefore(paging: RegularTaskPaging, fetchType: FetchTasksTypes, columnsShow: RegularTaskColumnsShow | null,
        filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null) {
        const hasNext = fetchType === 'fetchFromBegin' ? true : paging.hasNext
        if (!hasNext) {
            return { paging: paging, hasNext: hasNext }
        }

        let p = Object.assign({}, paging)
        p = {
            ...p,
            fetchType,
            filter: filter ?? p.filter,
            columnsShow: columnsShow ?? p.columnsShow,
            itemCount: fetchType === 'fetchFromBegin' ? 0 : p.itemCount,
            skip: fetchType === 'fetchFromBegin' ? 0 : p.skip,
            hasNext: hasNext,
            hasPrevious: fetchType === 'fetchFromBegin' ? false : p.hasPrevious,
        }

        return { paging: p, hasNext: hasNext }
    },
    mapPagingAfter(paging: RegularTaskPaging, itemCount: number) {
        let p = Object.assign({}, paging)

        p.skip = p.skip + REGULAR_TASK_TAKE_ITEMS_COUNT
        p.itemCount = itemCount
        p.hasPrevious = p.skip > 0
        p.hasNext = p.skip < p.itemCount

        return p
    },
    fetchRegTasks(this: Repository<RegularTask>, paging: RegularTaskPaging): Promise<[RegularTask[], number]> {
        return this.findAndCount({
            where: paging.filter.where,
            withDeleted: paging.filter.withDeleted,
            order: paging.order,
            skip: paging.skip,
            take: paging.take,
        } as FindManyOptions<RegularTask>)
    },
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
                time, period, periodSize, useLastDayFix, su, mo, tu, we, th, fr, sa, title, 
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
                    d.time, d.period, d.periodSize, d.useLastDayFix, d.su, d.mo, d.tu, d.we, d.th, d.fr, d.sa, d.title, 
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
    createRegTask(this: Repository<RegularTask>, item: RegularTask): Promise<RegularTask> {
        let t = new RegularTask()
        t = {
            ...t,
            ...item,
            id: t.id,
        }
        return this.save(t)
    },
    async updateRegTask(this: Repository<RegularTask>, item: RegularTask): Promise<RegularTask> {
        let rt = await this.findOneBy({ id: item.id })
        rt = {
            ...rt,
            ...item,
        }
        return this.save(rt)
    },
    async removeRegTask(this: Repository<RegularTask>, id: number, softRemove: boolean): Promise<RegularTask> {
        const findOpts = { id } as FindOptionsWhere<RegularTask>

        if (softRemove) {
            const taskToRemove = await this.findOneBy(findOpts)
            return this.softRemove(taskToRemove!)
        } else {
            const taskToRemove = await this.findOne({
                where: findOpts,
                withDeleted: true,
            } as FindOneOptions<RegularTask>)
            return this.remove(taskToRemove!)
        }
    }
} as RegularTaskExtendedRepository