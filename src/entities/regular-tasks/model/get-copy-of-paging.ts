import { createSelector } from '@reduxjs/toolkit'
import { Paging } from '@shared/lib/types'
import { RegularTask } from '../types/regular-task'


export const getCopyOfPaging = createSelector(
    [
        (state: RootState) => state.regularTasks.paging
    ],
    (paging: Paging<RegularTask>) => {
        return JSON.parse(JSON.stringify(paging)) as Paging<RegularTask>
    }
)
