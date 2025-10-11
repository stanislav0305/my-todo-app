import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { randomHelper } from '@shared/lib/helpers'
import { DEFAULT_TASK, INITIAL_TASKS_STATE } from '../constants'
import { Task } from '../types/task'


export const tasksSlice = createSlice({
    name: 'tasksSlice',
    initialState: INITIAL_TASKS_STATE,
    reducers: {
        addTask: (draftState, action: PayloadAction<Task>) => {
            const key = randomHelper.genUniqueId()
            let item = {
                ...DEFAULT_TASK,
                ...action.payload,
                key: key,
            } satisfies Task

            draftState.tasks[key] = item
        },
        editTask: (draftState, action: PayloadAction<Task>) => {
            const item = { ...action.payload }

            draftState.tasks[item.key] = {
                ...draftState.tasks[item.key],
                ...item
            } satisfies Task
        },
        deleteTask: (draftState, action: PayloadAction<string>) => {
            delete draftState.tasks[action.payload]

        },
    },
})

export const { addTask, editTask, deleteTask } = tasksSlice.actions
export const tasksReducers = tasksSlice.reducer