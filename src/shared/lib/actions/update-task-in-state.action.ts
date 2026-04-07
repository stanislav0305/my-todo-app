import { Task } from '@entities/tasks'
import { createAction, PayloadAction } from "@reduxjs/toolkit"


export const updateTaskInState = createAction('UPDATE_TASK_STATE', (item: Task) => {
    return { payload: item } as PayloadAction<Task>
})