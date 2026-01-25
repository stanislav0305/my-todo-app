import { DropDownItems } from '@/src/shared/lib/types'

export type RegularTasksFilterModeType =
    | 'all'
    | 'today'
    | 'byPeriod'
    | 'inTrash'
export const filterModes: Record<RegularTasksFilterModeType, DropDownItems> = {
    all: {
        label: 'all',
        value: 'all',
        iconType: 'MaterialDesignIcons',
        icon: 'all-inclusive',
    },
    today: {
        label: 'today',
        value: 'today',
        iconType: 'MaterialDesignIcons',
        icon: 'calendar-today',
    },
    byPeriod: {
        label: 'by period',
        value: 'byPeriod',
        iconType: 'MaterialDesignIcons',
        icon: 'calendar-multiselect',
    },
    inTrash: {
        label: 'in trash',
        value: 'inTrash',
        iconType: 'MaterialDesignIcons',
        icon: 'trash-can',
    },
}

export const filterModesDropDownItems = Object.entries(filterModes).map(
    (value: [string, DropDownItems]) => {
        return value[1] as DropDownItems
    },
)
