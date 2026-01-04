import { Paging } from '@shared/lib/types/paging'
import { Period, RegularTask } from './types/regular-task'
import { RegularTasksState } from './types/regular-tasks-state'


export const REGULAR_TASK_TAKE_ITEMS_COUNT = 10

export const DEFAULT_REGULAR_TASK = {
    id: 0,
    time: '',
    from: new Date(Date.now()),
    to: null,
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
    isUrgent: false,
} as RegularTask

const DEFAULT_REGULAR_TASK_PAGING = {
    fetchType: 'fetchFromBegin',
    itemCount: 0,
    skip: REGULAR_TASK_TAKE_ITEMS_COUNT * (-1),
    take: REGULAR_TASK_TAKE_ITEMS_COUNT,
    hasNext: true,
    hasPrevious: false,
    order: { from: 'ASC', time: 'ASC' },
    where: undefined,
} as Paging<RegularTask>

export const INITIAL_REGULAR_TASKS_STATE = {
    paging: DEFAULT_REGULAR_TASK_PAGING,
    items: [] as RegularTask[],
} satisfies RegularTasksState as RegularTasksState

export const periodNames: Record<Period, string> = {
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