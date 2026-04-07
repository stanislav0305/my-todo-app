import { DropDownItems } from "@/src/shared/lib/types"


export type TasksFilterModeType = 'all' | 'inTrash'
export const filterModes: Record<TasksFilterModeType, DropDownItems> = {
    'all': { label: 'all', value: 'all', iconType: 'MaterialDesignIcons', icon: 'all-inclusive' },
    'inTrash': { label: 'in trash', value: 'inTrash', iconType: 'MaterialDesignIcons', icon: 'trash-can' },
}

export const filterModesDropDownItems = Object.entries(filterModes)
    .map((value: [string, DropDownItems]) => {
        return value[1] as DropDownItems
    })