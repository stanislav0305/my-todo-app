import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { removeTaskFromState, revertAll, updateTaskInState } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { ActualTaskViewExtendedRepository, fetchReloadActualTasks } from '../../actual-tasks'
import { DEFAULT_TASK, INITIAL_TASKS_STATE } from '../constants'
import { TaskColumnsShow } from '../types/task-columns-show'
import { Task } from '../types/task.entity'
import { TasksFilterModeType } from '../types/tasks-filter-mode-type'
import { TaskPaging } from '../types/tasks-paging'
import { TaskExtendedRepository } from './task.extended.repository'


export const tasksSlice = createSlice({
    name: 'tasksSlice',
    initialState: INITIAL_TASKS_STATE,
    extraReducers: builder =>
        builder
            .addCase(revertAll, () => INITIAL_TASKS_STATE)
            .addCase(updateTaskInState, (draftState, action: PayloadAction<Task>) => {
                console.log(`${action.type} tasksSlice`, action.payload)

                const item = action.payload
                const index = draftState.items.findIndex(i => i.id === item.id)

                if (index >= 0) {
                    draftState.items[index] = {
                        ...draftState.items[index],
                        ...item,
                    } satisfies Task
                }
            })
            .addCase(removeTaskFromState, (draftState, action: PayloadAction<number>) => {
                console.log(`${action.type} tasksSlice`, action.payload)

                const id = action.payload
                const itemExist = draftState.items.findIndex(i => i.id === id) >= 0

                if (itemExist) {
                    draftState.items = draftState.items.filter(i => i.id !== id)
                    draftState.paging.skip--
                    draftState.paging.itemCount--
                }
            }),
    reducers: {
        resetMany: (draftState, action: PayloadAction<{ tasks: Task[]; paging: TaskPaging }>) => {
            const { tasks, paging } = action.payload

            draftState.items = [...tasks]
            draftState.paging = paging
        },
        appendMany: (draftState, action: PayloadAction<{ tasks: Task[]; paging: TaskPaging }>) => {
            const { tasks, paging } = action.payload

            draftState.items = [...draftState.items, ...tasks]
            draftState.paging = paging
        },
        resetPaging: (draftState, action: PayloadAction<{ paging: TaskPaging }>) => {
            const { paging } = action.payload
            draftState.paging = paging
        },
        setCurrentItem: (draftState, action: PayloadAction<Task>) => {
            const item = action.payload
            draftState.currentItem = item
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

const { appendMany, resetMany, resetPaging, setCurrentItem } = tasksSlice.actions
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
            thunkApi.dispatch(resetMany({ tasks: items, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendMany({ tasks: items, paging: newP }))


        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

const fetchReloadTasks = createAsyncThunk(
    'tasks/fetchReload',
    async ({ taskRep }: { taskRep: TaskExtendedRepository }, thunkApi) => {
        console.log('tasks/fetchReload...')

        const state = thunkApi.getState() as RootState

        const reloadPaging: TaskPaging = { ...state.tasks.paging }
        reloadPaging.take = reloadPaging.skip
        reloadPaging.skip = 0

        const [items, itemCount] = await taskRep.fetchTasks(reloadPaging)
        thunkApi.dispatch(resetMany({ tasks: items, paging: state.tasks.paging }))

        console.log(`fetchReload end (loaded row count:${itemCount}, before reload row count ${reloadPaging.itemCount})`)
    },
)

const findOneTask = createAsyncThunk(
    'tasks/findOneTask',
    async ({ taskRep, id }: { taskRep: TaskExtendedRepository, id: number }, thunkApi) => {
        const item = id === 0
            ? ({ ...DEFAULT_TASK } as Task)
            : await taskRep.findOneTask(id, true)

        thunkApi.dispatch(setCurrentItem(item))
    },
)

const createTask = createAsyncThunk(
    'tasks/createTask',
    async ({ taskRep, actualTaskViewRep, item }
        : { taskRep: TaskExtendedRepository, actualTaskViewRep: ActualTaskViewExtendedRepository, item: Task }, thunkApi) => {
        await taskRep.createTask(item)

        await thunkApi.dispatch(fetchReloadTasks({ taskRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskRep, actualTaskViewRep, item }
        : { taskRep: TaskExtendedRepository, actualTaskViewRep: ActualTaskViewExtendedRepository, item: Task }, thunkApi) => {
        const [needListReload, i] = await taskRep.updateTask(item)

        if (needListReload) {
            await thunkApi.dispatch(fetchReloadTasks({ taskRep }))
            await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
        }
        else
            thunkApi.dispatch(updateTaskInState(i))
    },
)

const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async ({ taskRep, actualTaskViewRep, id, softRemove }: { taskRep: TaskExtendedRepository, actualTaskViewRep: ActualTaskViewExtendedRepository, id: number, softRemove: boolean }, thunkApi) => {
        softRemove && await taskRep.softRemoveTask(id)
        !softRemove && await taskRep.removeTask(id)

        await thunkApi.dispatch(fetchReloadTasks({ taskRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const restoreTask = createAsyncThunk(
    'tasks/restoreTask',
    async ({ taskRep, actualTaskViewRep, id }: { taskRep: TaskExtendedRepository, actualTaskViewRep: ActualTaskViewExtendedRepository, id: number }, thunkApi) => {
        await taskRep.restoreTask(id)

        await thunkApi.dispatch(fetchReloadTasks({ taskRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

export { createTask, fetchTasks, findOneTask, removeTask, resetPaging, restoreTask, updateTask }

