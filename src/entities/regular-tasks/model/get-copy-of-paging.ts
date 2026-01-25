import { createSelector } from '@reduxjs/toolkit'
import { RegularTaskPaging } from '../types/regular-tasks-paging'


export const getCopyOfPaging = createSelector(
    [
        (state: RootState) => state.regularTasks.paging
    ],
    (paging: RegularTaskPaging) => {
        return JSON.parse(JSON.stringify(paging)) as RegularTaskPaging
    }
)
