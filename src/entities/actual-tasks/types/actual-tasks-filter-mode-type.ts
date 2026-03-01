import { DropDownItems } from '@/src/shared/lib/types'


export type ActualTasksFilterModeType =
    | 'today'
    | 'byWeek'
    | 'byMonth'

export const filterModes: Record<ActualTasksFilterModeType, DropDownItems> = {
    today: {
        label: 'today',
        value: 'today',
        iconType: 'MaterialDesignIcons',
        icon: 'calendar-today',
    },
    byWeek: {
        label: 'by week',
        value: 'byWeek',
        iconType: 'MaterialDesignIcons',
        icon: 'calendar-multiselect',
    },
    byMonth: {
        label: 'by month',
        value: 'byMonth',
        iconType: 'MaterialDesignIcons',
        icon: 'calendar-multiselect',
    },
}

export const filterModesDropDownItems = Object.entries(filterModes).map(
    (value: [string, DropDownItems]) => {
        return value[1] as DropDownItems
    },
)
