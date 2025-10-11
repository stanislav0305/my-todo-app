import { createSelector } from '@reduxjs/toolkit'


export const selectTasks = createSelector(
    [
        (state: RootState) => state.tasksManagement.tasks
    ],
    (tasks) => {
        return Object.values(tasks)
    }
)