import { createSelector } from "@reduxjs/toolkit"
import { TaskPaging } from "../types/tasks-paging"


export const getCopyOfPaging = createSelector(
    [
        (state: RootState) => state.tasks.paging
    ],
    (paging: TaskPaging) => {
        return JSON.parse(JSON.stringify(paging)) as TaskPaging
    }
)
