import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, Repository } from 'typeorm'
import { REGULAR_TASK_TAKE_ITEMS_COUNT } from '../constants'
import { mapper } from '../mapper'
import { RegularTaskColumnsShow } from '../types/regular-task-columns-show'
import { RegularTaskView } from '../types/regular-task-view.entity'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import { RegularTasksFilterModeType } from '../types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from '../types/regular-tasks-paging'


export interface RegularTaskViewExtendedRepository extends Repository<RegularTask> {
    mapPagingBefore(paging: RegularTaskPaging, fetchType: FetchTasksTypes, columnsShow: RegularTaskColumnsShow | null,
        filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null): { paging: RegularTaskPaging, hasNext: boolean }
    mapPagingAfter(paging: RegularTaskPaging, itemCount: number): RegularTaskPaging
    fetchRegTasks(paging: RegularTaskPaging): Promise<[RegularTaskModel[], number]>
}

export const regularTaskViewExtendedRepository: RegularTaskViewExtendedRepository = {
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
    async fetchRegTasks(this: Repository<RegularTaskView>, paging: RegularTaskPaging)
        : Promise<[RegularTaskModel[], number]> {
        console.log('paging', paging)

        console.log('-------------------------')
        const [items, itemCount] = await this.findAndCount({
            where: paging.filter.where,
            withDeleted: paging.filter.withDeleted,
            order: paging.order,
            skip: paging.skip,
            take: paging.take
        } as FindManyOptions<RegularTaskView>)

        const models = items.map(item => {
            return mapper.mapRegTaskViewToModel(item)
        })
        console.log('-------------------------')

        const result: [RegularTaskModel[], number] = [models, itemCount]
        return result
    }
} as RegularTaskViewExtendedRepository satisfies RegularTaskViewExtendedRepository