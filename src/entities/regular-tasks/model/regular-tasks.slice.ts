import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { INITIAL_REGULAR_TASKS_STATE } from '../constants'
import { RegularTask } from '../types/regular-task'
import { RegularTaskColumnsShow } from '../types/regular-task-columns-show'
import { RegularTasksFilterModeType } from '../types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from '../types/regular-tasks-paging'
import { RegularTaskExtendedRepository } from './regular-task.extended.repository'

export const regularTasksSlice = createSlice({
    name: 'regularTasksSlice',
    initialState: INITIAL_REGULAR_TASKS_STATE,
    extraReducers: builder =>
        builder.addCase(revertAll, () => INITIAL_REGULAR_TASKS_STATE),
    reducers: {
        setRegTasks: (
            draftState,
            action: PayloadAction<{
                regularTasks: RegularTask[]
                paging: RegularTaskPaging
            }>,
        ) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...regularTasks]
            draftState.paging = paging
        },
        appendRegTasks: (
            draftState,
            action: PayloadAction<{
                regularTasks: RegularTask[]
                paging: RegularTaskPaging
            }>,
        ) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...draftState.items, ...regularTasks]
            draftState.paging = paging
        },
        setRegPaging: (draftState, action: PayloadAction<{ paging: RegularTaskPaging }>) => {
            const { paging } = action.payload
            draftState.paging = paging
        },
        /*  create: (draftState, action: PayloadAction<RegularTask>) => {
                      let item = {
                          ...DEFAULT_REGULAR_TASK,
                          ...action.payload,
                      } satisfies RegularTask
          
                      if (!draftState.items)
                          draftState.items = []
          
                      draftState.items.push(item)
                  }, */
        update: (draftState, action: PayloadAction<RegularTask>) => {
            const item = { ...action.payload }
            const index = draftState.items.findIndex(i => i.id === item.id)

            if (index >= 0) {
                draftState.items[index] = {
                    ...draftState.items[index],
                    ...item,
                } satisfies RegularTask
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

const { appendRegTasks, setRegTasks, setRegPaging, update, remove } =
    regularTasksSlice.actions
export const regularTasksReducers = regularTasksSlice.reducer


const fetchRegTasks = createAsyncThunk(
    'regularTasks/fetch',
    async ({ regularTaskRep, paging, fetchType, columnsShow, filter, }: {
        regularTaskRep: RegularTaskExtendedRepository, paging: RegularTaskPaging, fetchType: FetchTasksTypes,
        columnsShow: RegularTaskColumnsShow | null, filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null
    }, thunkApi) => {
        console.log('regularTasks/fetch...')

        const mp = regularTaskRep.mapPagingBefore(paging, fetchType, columnsShow, filter)
        if (!mp.hasNext) {
            console.log(`regularTasks/fetch stopped (hasNext:${mp.hasNext})`)
            return
        }

        const [items, itemCount] = await regularTaskRep.fetchRegTasks(mp.paging)
        const newP = regularTaskRep.mapPagingAfter(mp.paging, itemCount)

        if (newP.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(setRegTasks({ regularTasks: items, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendRegTasks({ regularTasks: items, paging: newP }))


        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

const createRegTask = createAsyncThunk(
    'regularTasks/createRegTask',
    async ({ regularTaskRep, item }: { regularTaskRep: RegularTaskExtendedRepository, item: RegularTask }) => {
        await regularTaskRep.createRegTask(item)
    },
)

const updateRegTask = createAsyncThunk(
    'regularTasks/updateRegTask',
    async ({ regularTaskRep, item }: { regularTaskRep: RegularTaskExtendedRepository, item: RegularTask }, thunkApi) => {
        const i = await regularTaskRep.updateRegTask(item)
        thunkApi.dispatch(update(i))
    },
)

const removeRegTask = createAsyncThunk(
    'regularTasks/removeRegTask',
    async ({ regularTaskRep, id, softRemove, }: { regularTaskRep: RegularTaskExtendedRepository, id: number, softRemove: boolean }, thunkApi) => {
        await regularTaskRep.removeRegTask(id, softRemove)
        thunkApi.dispatch(remove(id))
    },
)

export { createRegTask, fetchRegTasks, removeRegTask, setRegPaging, updateRegTask }

