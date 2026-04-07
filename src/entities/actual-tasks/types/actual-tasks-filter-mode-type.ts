import { DropDownItems } from '@/src/shared/lib/types'


export type ActualTasksFilterModeType =
    | 'byDay'
    | 'byWeek'
    | 'byMonth'
    | 'inTrash'

export const filterModes: Record<ActualTasksFilterModeType, DropDownItems> = {
    byDay: {
        label: 'by day',
        value: 'byDay',
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
    inTrash: {
        label: 'in trash',
        value: 'inTrash',
        iconType: 'MaterialDesignIcons',
        icon: 'trash-can',
    }
}

export const filterModesDropDownItems = Object.entries(filterModes).map(
    (value: [string, DropDownItems]) => {
        return value[1] as DropDownItems
    },
)
