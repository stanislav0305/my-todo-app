import { DropDownItems } from '@/src/shared/lib/types'

export type RegularTasksFilterModeType = 'all' | 'inTrash'
export const filterModes: Record<RegularTasksFilterModeType, DropDownItems> = {
    all: {
        label: 'all',
        value: 'all',
        iconType: 'MaterialDesignIcons',
        icon: 'all-inclusive',
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
