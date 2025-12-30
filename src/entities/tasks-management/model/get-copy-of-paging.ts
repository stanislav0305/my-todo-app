import { Paging } from "@/src/shared/lib/types"
import { createSelector } from "@reduxjs/toolkit"
import { Task } from "../types/task"


export const getCopyOfPaging = createSelector(
    [
        (state: RootState) => state.tasksManagement.paging
    ],
    (paging: Paging<Task>) => {
        return JSON.parse(JSON.stringify(paging)) as Paging<Task>
    }
)
