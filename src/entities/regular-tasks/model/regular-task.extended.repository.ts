import { mapper } from '@entities/regular-tasks/mapper'
import { dateHelper } from '@shared/lib/helpers'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { REGULAR_TASK_TAKE_ITEMS_COUNT } from '../constants'
import { RegularTaskColumnsShow } from '../types/regular-task-columns-show'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import { RegularTasksFilterModeType } from '../types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from '../types/regular-tasks-paging'
import { RegularTaskWeekExtendedRepository } from './regular-task-week.extended.repository'


export interface RegularTaskExtendedRepository extends Repository<RegularTask> {
    mapPagingBefore(paging: RegularTaskPaging, fetchType: FetchTasksTypes, columnsShow: RegularTaskColumnsShow | null,
        filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null): { paging: RegularTaskPaging, hasNext: boolean }
    mapPagingAfter(paging: RegularTaskPaging, itemCount: number): RegularTaskPaging
    fetchRegTasks(weekRep: RegularTaskWeekExtendedRepository, paging: RegularTaskPaging): Promise<[RegularTaskModel[], number]>
    findByPeriod(from: Date, to: Date): Promise<RegularTask[]>

    createRegTask(model: RegularTaskModel): Promise<RegularTaskModel>
    updateRegTask(model: RegularTaskModel): Promise<RegularTaskModel>
    removeRegTask(id: number, softRemove: boolean): Promise<RegularTask[]>
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
    async fetchRegTasks(this: Repository<RegularTask>, weekRep: RegularTaskWeekExtendedRepository, paging: RegularTaskPaging): Promise<[RegularTaskModel[], number]> {

        console.log('paging', paging)


        const [items] = await this.findAndCount({
            where: paging.filter.where,
            withDeleted: paging.filter.withDeleted,
            order: paging.order,
            skip: paging.skip,
            take: paging.take,
            relations: ['week']
        } as FindManyOptions<RegularTask>)


        //-------------------------------
        // let queryBuilder = this.createQueryBuilder('regularTasks')

        // paging.filter.withDeleted && queryBuilder.withDeleted()

        //queryBuilder.where(paging.filter.where)
        //.where('table.id = :id', { id: 'some-id' })
        /*  const items = await queryBuilder.leftJoin(
              'regularTasks.week',
              'regularTasksWeek',
              ` regularTasksWeek.suRegularTaskId = regularTasks.id 
      OR regularTasksWeek.moRegularTaskId = regularTasks.id 
      OR regularTasksWeek.tuRegularTaskId = regularTasks.id 
      OR regularTasksWeek.weRegularTaskId = regularTasks.id 
      OR regularTasksWeek.thRegularTaskId = regularTasks.id 
      OR regularTasksWeek.frRegularTaskId = regularTasks.id 
      OR regularTasksWeek.saRegularTaskId = regularTasks.id 
              )`
          )
              .getMany() */
        //   queryBuilder.leftJoinAndSelect('regularTasks.week', 'regularTasksWeek')


        // this removes all ".deletedAt IS NULL" conditions, so that soft-deleted relations will also be included in the response
        /* queryBuilder.expressionMap.joinAttributes
             .filter(
                 ({ condition }) =>
                     condition && /.+\.deletedAt IS NULL/gi.test(condition),
             )
             .forEach((joinAttribute: JoinAttribute) => {
                 joinAttribute.condition = undefined
             })
 */

        //GROUP BY WEEK

        // this.createQueryBuilder('')
        //.where("user.name = :name", { name: "Timber" })
        //.getManyAndCount()
        /*  const week = items.find(item => item.period === 'everyWeek')
          console.log('week', week)
  
          const groupedItems: RegularTask[] = []
          let m = Map.groupBy<number | undefined, RegularTask>(items, item => item.week?.id)
          console.log('MMMMMMMMMMMMMMM', m)
  
          m.forEach((value: RegularTask[], key: number | undefined) => {
              if (typeof key !== 'undefined')
                  groupedItems.push(value[0])
              else
                  groupedItems.push(...value)
          })
  
          const models = groupedItems.map(item => {
              return mapper.mapToModel(item)
          }) */

        //   const items = await queryBuilder.getMany()
        //-------------------------------
        /*
        const items = await this.query<RegularTask[]>(`
            SELECT regularTasks.*,
            regularTasksWeek.id as "week.id"
            FROM regularTasks 
            LEFT JOIN regularTasksWeek
            ON   regularTasksWeek.suRegularTaskId = regularTasks.id 
                OR regularTasksWeek.moRegularTaskId = regularTasks.id 
                OR regularTasksWeek.tuRegularTaskId = regularTasks.id 
                OR regularTasksWeek.weRegularTaskId = regularTasks.id 
                OR regularTasksWeek.thRegularTaskId = regularTasks.id 
                OR regularTasksWeek.frRegularTaskId = regularTasks.id 
                OR regularTasksWeek.saRegularTaskId = regularTasks.id 
        `)
*/


        // console.log('-------------------------')
        // console.log('ZZZZZZZZZZZZ items:', JSON.stringify(items))

        const models = items.map(item => {
            return mapper.mapToModel(item)
        })
        //  console.log('-------------------------')
        //  console.log('ZZZZZZZZZZZZ models:', JSON.stringify(models))

        //  const w = await weekRep.findOneRegTaskWeek(1, true)
        //   console.log('ZZZZZZZZZZZZ w', w)
        ////  console.log('ZZZZZZZZZZZZ w.id', w.id)

        const result: [RegularTaskModel[], number] = [models, models.length]
        return result
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

    async updateRegTask(model: RegularTaskModel): Promise<RegularTaskModel> {
        let rt = (await this.findOneBy({ id: model.id }))!

        rt = mapper.mapToEntity({ model, rt })
        const result = await this.save(rt)

        return mapper.mapToModel(result)
    },
    async removeRegTask(id: number, softRemove: boolean): Promise<RegularTask[]> {
        const taskToRemove = await this.find({
            where: { id } as FindOptionsWhere<RegularTask>,
            withDeleted: softRemove ? undefined : true,
        } as FindOneOptions<RegularTask>)

        const result = softRemove
            ? await this.softRemove(taskToRemove)
            : await this.remove(taskToRemove)

        return result
    },
} as RegularTaskExtendedRepository satisfies RegularTaskExtendedRepository