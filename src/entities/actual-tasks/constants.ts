import { DbFilter } from '@shared/lib/types'
import { FindOptionsWhere, IsNull } from 'typeorm'
import { ActualTaskColumnsShow } from './types/actual-task-columns-show'
import { ActualTaskPagingPeriodModel } from './types/actual-task-paging-period.model'
import { ActualTaskView } from './types/actual-task-view.entity'
import { ActualTaskModel } from './types/actual-task.model'
import { ActualTasksFilterModeType } from './types/actual-tasks-filter-mode-type'
import { ActualTaskPagingModel } from './types/actual-tasks-paging.model'
import { ActualTasksState } from './types/actual-tasks-state'


export const ACTUAL_TASK_TAKE_ITEMS_COUNT = 20

export const DEFAULT_ACTUAL_TASK_PAGING = {
    fetchType: 'fetchFromBegin',
    itemCount: 0,
    skip: ACTUAL_TASK_TAKE_ITEMS_COUNT * (-1),
    take: ACTUAL_TASK_TAKE_ITEMS_COUNT,
    hasNext: true,
    hasPrevious: false,
    filter: {
        mode: 'byDay',
        count: 0,
        //for view typeorm automatically not add this query part
        where: { deletedAt: IsNull() } as FindOptionsWhere<ActualTaskView> | undefined,
    } as DbFilter<ActualTaskView, ActualTasksFilterModeType>,
    columnsShow: {} as ActualTaskColumnsShow,
    order: { date: 'ASC', time: 'ASC' },
} as ActualTaskPagingModel

export const INITIAL_ACTUAL_TASKS_STATE = {
    paging: DEFAULT_ACTUAL_TASK_PAGING,
    pagingPeriod: {} as ActualTaskPagingPeriodModel,
    items: [] as ActualTaskModel[],
} satisfies ActualTasksState as ActualTasksState