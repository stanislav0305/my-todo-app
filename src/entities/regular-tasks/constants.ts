import { dateHelper } from '@shared/lib/helpers'
import { DbFilter } from '@shared/lib/types'
import { Period, RegularTask } from './types/regular-task'
import { RegularTaskColumnsShow } from './types/regular-task-columns-show'
import { RegularTasksFilterModeType } from './types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from './types/regular-tasks-paging'
import { RegularTasksState } from './types/regular-tasks-state'


export const REGULAR_TASK_TAKE_ITEMS_COUNT = 20

export const DEFAULT_REGULAR_TASK = {
    id: 0,
    time: '',
    beginDate: dateHelper.toFormattedString(new Date(Date.now()), 'YYYY-MM-DD'),
    endDate: null,
    period: 'everyDay',
    periodSize: 1,
    useLastDayFix: true,
    su: false,
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    title: '',
    isImportant: false,
    isUrgent: false
} as RegularTask

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
        where: undefined,
    } as DbFilter<RegularTask, RegularTasksFilterModeType>,
    columnsShow: {} as RegularTaskColumnsShow,
    order: { beginDate: 'ASC', time: 'ASC' },
} as RegularTaskPaging

export const INITIAL_REGULAR_TASKS_STATE = {
    paging: DEFAULT_REGULAR_TASK_PAGING,
    items: [] as RegularTask[],
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