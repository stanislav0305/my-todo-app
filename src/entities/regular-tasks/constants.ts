import { dateHelper } from '@shared/lib/helpers'
import { DbFilter } from '@shared/lib/types'
import { FindOptionsWhere, IsNull } from 'typeorm'
import { RegularTaskColumnsShow } from './types/regular-task-columns-show'
import { Period, RegularTask } from './types/regular-task.entity'
import { RegularTaskModel } from './types/regular-task.model'
import { RegularTasksFilterModeType } from './types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from './types/regular-tasks-paging'
import { RegularTasksState } from './types/regular-tasks-state'


export const REGULAR_TASK_TAKE_ITEMS_COUNT = 20

export const DEFAULT_REGULAR_TASK_MODEL = {
    id: 0,
    time: '',
    beginDate: dateHelper.toFormattedString(new Date(Date.now()), 'YYYY-MM-DD'),
    endDate: null,
    period: 'everyDay',
    periodSize: 1,
    title: '',
    isImportant: false,
    isUrgent: false,
} as RegularTaskModel

export const DEFAULT_REGULAR_TASK_PAGING = {
    fetchType: 'fetchFromBegin',
    itemCount: 0,
    skip: REGULAR_TASK_TAKE_ITEMS_COUNT * (-1),
    take: REGULAR_TASK_TAKE_ITEMS_COUNT,
    hasNext: true,
    hasPrevious: false,
    filter: {
        mode: 'all',
        count: 0,
        //for view typeorm automatically not add this query part
        where: { deletedAt: IsNull() } as FindOptionsWhere<RegularTask> | undefined,
    } as DbFilter<RegularTask, RegularTasksFilterModeType>,
    columnsShow: {} as RegularTaskColumnsShow,
    order: { beginDate: 'ASC', time: 'ASC' },
} as RegularTaskPaging

export const INITIAL_REGULAR_TASKS_STATE = {
    paging: DEFAULT_REGULAR_TASK_PAGING,
    items: [] as RegularTaskModel[],
    currentItem: { ...DEFAULT_REGULAR_TASK_MODEL } as RegularTaskModel,
} satisfies RegularTasksState as RegularTasksState

const periodNames: Record<Period, string> = {
    'everyDay': 'Every day',
    'everyWeek': 'Every week',
    'everyMonth': 'Every month',
    'everyYear': 'Every year'
}

export const periodNamesDropDownItems = Object.entries(periodNames)
    .map((value: [string, string]) => {
        const item = {
            label: value[1] as Period,
            value: value[0]
        }

        return item
    })