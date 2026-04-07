
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, Repository } from 'typeorm'
import { ACTUAL_TASK_TAKE_ITEMS_COUNT } from '../constants'
import { mapper } from '../mapper'
import { ActualTaskColumnsShow } from '../types/actual-task-columns-show'
import { ActualTaskView } from '../types/actual-task-view.entity'
import { ActualTaskModel } from '../types/actual-task.model'
import { ActualTasksFilterModeType } from '../types/actual-tasks-filter-mode-type'
import { ActualTaskPagingModel } from '../types/actual-tasks-paging.model'


export interface ActualTaskViewExtendedRepository extends Repository<ActualTaskView> {
    mapPagingBefore(paging: ActualTaskPagingModel, fetchType: FetchTasksTypes, columnsShow: ActualTaskColumnsShow | null,
        filter: DbFilter<ActualTaskView, ActualTasksFilterModeType> | null): { paging: ActualTaskPagingModel, hasNext: boolean }
    mapPagingAfter(paging: ActualTaskPagingModel, itemCount: number): ActualTaskPagingModel
    fetchActualTasks(paging: ActualTaskPagingModel): Promise<[ActualTaskModel[], number]>
}

export const actualTaskViewExtendedRepository: ActualTaskViewExtendedRepository = {
    mapPagingBefore(paging: ActualTaskPagingModel, fetchType: FetchTasksTypes, columnsShow: ActualTaskColumnsShow | null,
        filter: DbFilter<ActualTaskView, ActualTasksFilterModeType> | null) {
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
    mapPagingAfter(paging: ActualTaskPagingModel, itemCount: number) {
        let p = Object.assign({}, paging)

        p.skip = p.skip + ACTUAL_TASK_TAKE_ITEMS_COUNT
        p.itemCount = itemCount
        p.hasPrevious = p.skip > 0
        p.hasNext = p.skip < p.itemCount

        return p
    },
    async fetchActualTasks(this: Repository<ActualTaskView>, paging: ActualTaskPagingModel)
        : Promise<[ActualTaskModel[], number]> {
        console.log('paging', paging)

        console.log('-------------------------')
        const [items, itemCount] = await this.findAndCount({
            where: paging.filter.where,
            withDeleted: paging.filter.withDeleted,
            order: paging.order,
            skip: paging.skip,
            take: paging.take
        } as FindManyOptions<ActualTaskView>)

        const models = items.map(item => {
            return mapper.mapActualTaskViewToModel(item)
        })
        console.log('-------------------------')

        const result: [ActualTaskModel[], number] = [models, itemCount]
        return result
    }
} as ActualTaskViewExtendedRepository satisfies ActualTaskViewExtendedRepository