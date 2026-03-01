
import { createSelector } from '@reduxjs/toolkit'
import { ActualTaskPagingModel } from '../types/actual-tasks-paging.model'


export const getCopyOfPaging = createSelector(
    [
        (state: RootState) => state.actualTasks.paging
    ],
    (paging: ActualTaskPagingModel) => {
        return JSON.parse(JSON.stringify(paging)) as ActualTaskPagingModel
    }
)