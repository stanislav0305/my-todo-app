import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { INITIAL_REGULAR_TASKS_STATE } from '../constants'
import { RegularTaskColumnsShow } from '../types/regular-task-columns-show'
import { RegularTask } from '../types/regular-task.entity'
import { RegularTaskModel } from '../types/regular-task.model'
import { RegularTasksFilterModeType } from '../types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from '../types/regular-tasks-paging'
import { RegularTaskViewExtendedRepository } from './regular-task-view.extended.repository'
import { RegularTaskWeekExtendedRepository } from './regular-task-week.extended.repository'
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
                regularTasks: RegularTaskModel[]
                paging: RegularTaskPaging
            }>,
        ) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...regularTasks]
            draftState.paging = paging
        },
        appendRegTasks: (draftState, action: PayloadAction<{ regularTasks: RegularTaskModel[], paging: RegularTaskPaging }>,
        ) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...draftState.items, ...regularTasks]
            draftState.paging = paging
        },
        setRegPaging: (draftState, action: PayloadAction<{ paging: RegularTaskPaging }>) => {
            const { paging } = action.payload
            draftState.paging = paging
        },
        update: (draftState, action: PayloadAction<RegularTaskModel>) => {
            const item = { ...action.payload }
            const index = draftState.items.findIndex(i => i.id === item.id)

            if (index >= 0) {
                draftState.items[index] = {
                    ...draftState.items[index],
                    ...item,
                } satisfies RegularTaskModel
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
        removeMany: (draftState, action: PayloadAction<number[]>) => {
            const ids = action.payload

            const newItems = draftState.items.filter(i => !ids.includes(i.id))
            const removedCount = draftState.items.length - newItems.length

            draftState.items = [...newItems]
            draftState.paging.skip = draftState.paging.skip -= removedCount
            draftState.paging.itemCount -= removedCount
        },
    },
})

const { appendRegTasks, setRegTasks, setRegPaging, update, remove, removeMany } = regularTasksSlice.actions
export { setRegPaging }
export const regularTasksReducers = regularTasksSlice.reducer

const fetchRegTasks = createAsyncThunk(
    'regularTasks/fetch',
    async ({ regularTaskViewRep, weekRep, paging, fetchType, columnsShow, filter, }: {
        regularTaskViewRep: RegularTaskViewExtendedRepository, weekRep: RegularTaskWeekExtendedRepository, paging: RegularTaskPaging, fetchType: FetchTasksTypes,
        columnsShow: RegularTaskColumnsShow | null, filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null
    }, thunkApi) => {
        console.log('regularTasks/fetch...')

        const mp = regularTaskViewRep.mapPagingBefore(paging, fetchType, columnsShow, filter)
        if (!mp.hasNext) {
            console.log(`regularTasks/fetch stopped (hasNext:${mp.hasNext})`)
            return
        }

        const [models, modelCount] = await regularTaskViewRep.fetchRegTasks(weekRep, mp.paging)


        const newP = regularTaskViewRep.mapPagingAfter(mp.paging, modelCount)

        if (newP.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(setRegTasks({ regularTasks: models, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendRegTasks({ regularTasks: models, paging: newP }))


        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

//--------------------------------------------------------

const createRegTask = createAsyncThunk(
    'regularTasks/createRegTask',
    async ({ regularTaskRep, model }: { regularTaskRep: RegularTaskExtendedRepository, model: RegularTaskModel }) => {
        await regularTaskRep.createRegTask(model)
    },
)

const updateRegTask = createAsyncThunk(
    'regularTasks/updateRegTask',
    async ({ regularTaskRep, regularTaskWeekRep, model, oldWeekId }: { regularTaskRep: RegularTaskExtendedRepository, regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined }, thunkApi) => {
        const m = await regularTaskRep.updateRegTask(regularTaskWeekRep, model, oldWeekId)
        thunkApi.dispatch(update(m))
    },
)

const removeRegTask = createAsyncThunk(
    'regularTasks/removeRegTask',
    async ({ regularTaskRep, id, softRemove }: { regularTaskRep: RegularTaskExtendedRepository, id: number, softRemove: boolean }, thunkApi) => {
        softRemove
            ? await regularTaskRep.softRemoveRegTask(id)
            : await regularTaskRep.removeRegTask(id)

        thunkApi.dispatch(remove(id))
    },
)

const restoreRegTask = createAsyncThunk(
    'regularTasks/restoreRegTask',
    async ({ regularTaskRep, id }: { regularTaskRep: RegularTaskExtendedRepository, id: number }, thunkApi) => {
        await regularTaskRep.restoreRegTask(id)
        thunkApi.dispatch(remove(id))
    },
)

export { createRegTask, fetchRegTasks, removeRegTask, restoreRegTask, updateRegTask }

//--------------------------------------------------------

const createRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/createRegTask',
    async ({ regularTaskWeekRep, model }: { regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel }) => {
        await regularTaskWeekRep.createRegTaskWeek(model)
    },
)

const updateRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/updateRegTask',
    async ({ regularTaskWeekRep, regularTaskRep, model, oldWeekId }: { regularTaskWeekRep: RegularTaskWeekExtendedRepository, regularTaskRep: RegularTaskExtendedRepository, model: RegularTaskModel, oldWeekId: number | null | undefined }, thunkApi) => {
        await regularTaskWeekRep.updateRegTaskWeek(regularTaskRep, model, oldWeekId)
    },
)

const removeRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/removeRegTask',
    async ({ regularTaskWeekRep, id, softRemove }: { regularTaskWeekRep: RegularTaskWeekExtendedRepository, id: number, softRemove: boolean }, thunkApi) => {

        const [, regTaskIds] = softRemove
            ? await regularTaskWeekRep.softRemoveRegTaskWeek(id)
            : await regularTaskWeekRep.removeRegTaskWeek(id)

        thunkApi.dispatch(removeMany(regTaskIds))
    },
)

const recoverRegTaskWeek = createAsyncThunk(
    'regularTasks/recoverRegTask',
    async ({ regularTaskWeekRep, id }: { regularTaskWeekRep: RegularTaskWeekExtendedRepository, id: number }, thunkApi) => {
        const [, regTaskIds] = await regularTaskWeekRep.recoverRegTaskWeek(id)

        thunkApi.dispatch(removeMany(regTaskIds))
    },
)

export { createRegTaskWeek, recoverRegTaskWeek, removeRegTaskWeek, updateRegTaskWeek }

