import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { INITIAL_TASKS_STATE } from '../constants'
import { Task } from '../types/task'
import { TaskColumnsShow } from '../types/task-columns-show'
import { TasksFilterModeType } from '../types/tasks-filter-mode-type'
import { TaskPaging } from '../types/tasks-paging'
import { TaskExtendedRepository } from './task.extended.repository'

export const tasksSlice = createSlice({
    name: 'tasksSlice',
    initialState: INITIAL_TASKS_STATE,
    extraReducers: builder =>
        builder.addCase(revertAll, () => INITIAL_TASKS_STATE),
    reducers: {
        setTasks: (
            draftState,
            action: PayloadAction<{ tasks: Task[]; paging: TaskPaging }>,
        ) => {
            const { tasks, paging } = action.payload

            draftState.items = [...tasks]
            draftState.paging = paging
        },
        appendTasks: (
            draftState,
            action: PayloadAction<{ tasks: Task[]; paging: TaskPaging }>,
        ) => {
            const { tasks, paging } = action.payload

            draftState.items = [...draftState.items, ...tasks]
            draftState.paging = paging
        },
        setPaging: (draftState, action: PayloadAction<{ paging: TaskPaging }>) => {
            const { paging } = action.payload
            draftState.paging = paging
        },
        /*  create: (draftState, action: PayloadAction<Task>) => {
                                                                          let item = {
                                                                              ...DEFAULT_TASK,
                                                                              ...action.payload,
                                                                          } satisfies Task
                                                              
                                                                          if (!draftState.items)
                                                                              draftState.items = []
                                                              
                                                                          draftState.items.push(item)
                                                                      }, */
        update: (draftState, action: PayloadAction<Task>) => {
            const item = { ...action.payload }
            const index = draftState.items.findIndex(i => i.id === item.id)

            if (index >= 0) {
                draftState.items[index] = {
                    ...draftState.items[index],
                    ...item,
                } satisfies Task
            }
        },
        remove: (draftState, action: PayloadAction<number>) => {
            const id = action.payload

            const itemExist = draftState.items.findIndex(i => i.id === id) >= 0
            if (itemExist) {
                draftState.items = draftState.items.filter(i => i.id !== id)
                draftState.paging.skip--
                draftState.paging.itemCount--
            }
        },
    },
})

const { appendTasks, setTasks, setPaging, update, remove } = tasksSlice.actions
export const tasksReducers = tasksSlice.reducer

const fetchTasks = createAsyncThunk(
    'tasks/fetch',
    async ({ taskRep, paging, fetchType, columnsShow, filter }: {
        taskRep: TaskExtendedRepository, paging: TaskPaging, fetchType: FetchTasksTypes,
        columnsShow: TaskColumnsShow | null, filter: DbFilter<Task, TasksFilterModeType> | null
    }, thunkApi) => {
        console.log('tasks/fetch...')

        const mp = taskRep.mapPagingBefore(paging, fetchType, columnsShow, filter)
        if (!mp.hasNext) {
            console.log(`regularTasks/fetch stopped (hasNext:${mp.hasNext})`)
            return
        }

        const [items, itemCount] = await taskRep.fetchTasks(mp.paging)
        const newP = taskRep.mapPagingAfter(mp.paging, itemCount)

        if (newP.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(setTasks({ tasks: items, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendTasks({ tasks: items, paging: newP }))


        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

const createTask = createAsyncThunk(
    'tasks/createTask',
    async ({ taskRep, item }: { taskRep: TaskExtendedRepository, item: Task }) => {
        await taskRep.createTask(item)
    },
)

const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskRep, item }: { taskRep: TaskExtendedRepository, item: Task }, thunkApi) => {
        const i = await taskRep.updateTask(item)
        thunkApi.dispatch(update(i))
    },
)

const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async ({ taskRep, id, softRemove }: { taskRep: TaskExtendedRepository, id: number, softRemove: boolean }, thunkApi) => {
        await taskRep.removeTask(id, softRemove!)
        thunkApi.dispatch(remove(id))
    },
)

export { createTask, fetchTasks, removeTask, setPaging, updateTask }

