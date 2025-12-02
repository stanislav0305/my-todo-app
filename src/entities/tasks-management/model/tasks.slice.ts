import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { Repository } from 'typeorm'
import { DEFAULT_TASK, INITIAL_TASKS_STATE } from '../constants'
import { Task } from '../types/task'
import { TasksState } from '../types/tasks-state'


export const tasksSlice = createSlice({
    name: 'tasksSlice',
    initialState: INITIAL_TASKS_STATE,
    extraReducers: (builder) => builder.addCase(revertAll, () => INITIAL_TASKS_STATE),
    reducers: {
        initialize: (draftState, action: PayloadAction<TasksState>) => {
            return action.payload
        },
        create: (draftState, action: PayloadAction<Task>) => {
            let item = {
                ...DEFAULT_TASK,
                ...action.payload,
            } satisfies Task

            if (!draftState.tasks)
                draftState.tasks = []

            draftState.tasks.push(item)
        },
        update: (draftState, action: PayloadAction<Task>) => {
            const item = { ...action.payload }
            const index = draftState.tasks.findIndex(i => i.id === item.id)

            if (index >= 0) {
                draftState.tasks[index] = {
                    ...draftState.tasks[index],
                    ...item
                } satisfies Task
            }
        },
        remove: (draftState, action: PayloadAction<number>) => {
            const id = action.payload

            const tasks = draftState.tasks.filter(i => i.id !== id)
            draftState.tasks = tasks
        },
    },
})

const { initialize, create, update, remove } = tasksSlice.actions
export const tasksReducers = tasksSlice.reducer


const initializeTasks = createAsyncThunk(
    'tasks/initialize',
    async (taskRep: Repository<Task>, thunkApi) => {
        const items = await taskRep.find()

        thunkApi.dispatch(initialize({
            tasks: items,
        } satisfies TasksState as TasksState))
    })

const createTask = createAsyncThunk(
    'tasks/createTask',
    async ({ taskRep, item }: { taskRep: Repository<Task>, item: Task }, thunkApi) => {
        let t = new Task()
        t = {
            ...t,
            ...item,
            id: t.id
        }

        const i = await taskRep.save(t)
        thunkApi.dispatch(create(i))
    })

const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskRep, item }: { taskRep: Repository<Task>, item: Task }, thunkApi) => {
        let t = await taskRep.findOneBy({ id: item.id, })
        t = {
            ...t,
            ...item,
        }
        const i = await taskRep.save(t)
        thunkApi.dispatch(update(i))
    })

const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async ({ taskRep, id }: { taskRep: Repository<Task>, id: number }, thunkApi) => {

        const taskToRemove = await taskRep.findOneBy({ id: id, })
        if (taskToRemove != null) {
            await taskRep.remove(taskToRemove)
            thunkApi.dispatch(remove(id))
        }
    })

export { createTask, initializeTasks, removeTask, updateTask }

