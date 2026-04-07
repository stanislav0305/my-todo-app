import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { ActualTaskViewExtendedRepository, fetchReloadActualTasks } from '../../actual-tasks'
import { DEFAULT_REGULAR_TASK_MODEL, INITIAL_REGULAR_TASKS_STATE } from '../constants'
import { mapper } from '../mapper'
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
        builder
            .addCase(revertAll, () => INITIAL_REGULAR_TASKS_STATE),
    reducers: {
        resetMany: (draftState, action: PayloadAction<{ regularTasks: RegularTaskModel[], paging: RegularTaskPaging }>) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...regularTasks]
            draftState.paging = paging
        },
        appendMany: (draftState, action: PayloadAction<{ regularTasks: RegularTaskModel[], paging: RegularTaskPaging }>) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...draftState.items, ...regularTasks]
            draftState.paging = paging
        },
        resetPaging: (draftState, action: PayloadAction<{ paging: RegularTaskPaging }>) => {
            const { paging } = action.payload
            draftState.paging = paging
        },
        setCurrentItem: (draftState, action: PayloadAction<RegularTaskModel>) => {
            const item = action.payload
            draftState.currentItem = item
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
    },
})

const { appendMany, resetMany, resetPaging, remove, setCurrentItem, update } = regularTasksSlice.actions
export { resetPaging }
export const regularTasksReducers = regularTasksSlice.reducer

//--------------------------------------------------------

const fetchRegTasks = createAsyncThunk(
    'regularTasks/fetch',
    async ({ regularTaskViewRep, paging, fetchType, columnsShow, filter, }: {
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        paging: RegularTaskPaging,
        fetchType: FetchTasksTypes,
        columnsShow: RegularTaskColumnsShow | null,
        filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null
    }, thunkApi) => {
        console.log('regularTasks/fetch...')

        const mp = regularTaskViewRep.mapPagingBefore(paging, fetchType, columnsShow, filter)
        if (!mp.hasNext) {
            console.log(`regularTasks/fetch stopped (hasNext:${mp.hasNext})`)
            return
        }

        const [models, modelCount] = await regularTaskViewRep.fetchRegTasks(mp.paging)
        const newP = regularTaskViewRep.mapPagingAfter(mp.paging, modelCount)

        if (newP.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(resetMany({ regularTasks: models, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendMany({ regularTasks: models, paging: newP }))

        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

//--------------------------------------------------------

const fetchReloadRegTasks = createAsyncThunk(
    'regularTasks/fetchReload',
    async ({ regularTaskViewRep }: { regularTaskViewRep: RegularTaskViewExtendedRepository }, thunkApi) => {
        console.log('tasks/fetchReload...')

        const state = thunkApi.getState() as RootState

        const reloadPaging: RegularTaskPaging = { ...state.regularTasks.paging }
        reloadPaging.take = reloadPaging.skip
        reloadPaging.skip = 0

        const [items, itemCount] = await regularTaskViewRep.fetchRegTasks(reloadPaging)
        thunkApi.dispatch(resetMany({ regularTasks: items, paging: state.regularTasks.paging }))

        console.log(`fetchReload end (loaded row count:${itemCount}, before reload row count ${reloadPaging.itemCount})`)
    },
)

//--------------------------------------------------------

const findAnyOneRegTask = createAsyncThunk(
    'regularTasks/findAnyOneRegTask',
    async ({ regularTaskRep, id }: { regularTaskRep: RegularTaskExtendedRepository, id: number }, thunkApi) => {
        //find any regular task (daily, weekly, monthly yearly)
        const item = id === 0
            ? ({ ...DEFAULT_REGULAR_TASK_MODEL } as RegularTaskModel)
            : mapper.mapToModel(await regularTaskRep.findOneRegTaskWithWeekDays(id, true))

        thunkApi.dispatch(setCurrentItem(item))
    },
)

const createRegTask = createAsyncThunk(
    'regularTasks/createRegTask',
    async ({ regularTaskRep, regularTaskViewRep, actualTaskViewRep, model }: {
        regularTaskRep: RegularTaskExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        model: RegularTaskModel
    }, thunkApi) => {
        //create daily, monthly or yearly reg task
        await regularTaskRep.createRegTask(model)

        await thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const updateRegTask = createAsyncThunk(
    'regularTasks/updateRegTask',
    async ({ regularTaskRep, regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, model, oldWeekId }: {
        regularTaskRep: RegularTaskExtendedRepository,
        regularTaskWeekRep: RegularTaskWeekExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        model: RegularTaskModel,
        oldWeekId: number | null | undefined
    }, thunkApi) => {
        const [needReload, m] = await regularTaskRep.updateRegTask(regularTaskWeekRep, model, oldWeekId)

        if (needReload)
            thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        else
            thunkApi.dispatch(update(m))

        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const removeRegTask = createAsyncThunk(
    'regularTasks/removeRegTask',
    async ({ regularTaskRep, regularTaskViewRep, actualTaskViewRep, id, softRemove }: {
        regularTaskRep: RegularTaskExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        id: number,
        softRemove: boolean
    }, thunkApi) => {
        softRemove && await regularTaskRep.softRemoveRegTask(id)
        !softRemove && await regularTaskRep.removeRegTask(id)

        await thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const restoreRegTask = createAsyncThunk(
    'regularTasks/restoreRegTask',
    async ({ regularTaskRep, actualTaskViewRep, id }: {
        regularTaskRep: RegularTaskExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        id: number
    }, thunkApi) => {
        await regularTaskRep.restoreRegTask(id)

        thunkApi.dispatch(remove(id))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

export { createRegTask, fetchRegTasks, removeRegTask, restoreRegTask, updateRegTask }

//--------------------------------------------------------

const createRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/createRegTask',
    async ({ regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, model }: {
        regularTaskWeekRep: RegularTaskWeekExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        model: RegularTaskModel
    }, thunkApi) => {
        await regularTaskWeekRep.createRegTaskWeek(model)

        await thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const updateRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/updateRegTask',
    async ({ regularTaskWeekRep, regularTaskRep, regularTaskViewRep, actualTaskViewRep, model, oldWeekId }: {
        regularTaskWeekRep: RegularTaskWeekExtendedRepository,
        regularTaskRep: RegularTaskExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        model: RegularTaskModel,
        oldWeekId: number | null | undefined
    }, thunkApi) => {
        await regularTaskWeekRep.updateRegTaskWeek(regularTaskRep, model, oldWeekId)

        await thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const removeRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/removeRegTask',
    async ({ regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, weekId, softRemove }: {
        regularTaskWeekRep: RegularTaskWeekExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        weekId: number,
        softRemove: boolean
    }, thunkApi) => {
        softRemove && await regularTaskWeekRep.softRemoveRegTaskWeek(weekId)
        !softRemove && await regularTaskWeekRep.removeRegTaskWeek(weekId)

        await thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

const recoverRegTaskWeek = createAsyncThunk(
    'regularTasks/recoverRegTask',
    async ({ regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, weekId }: {
        regularTaskWeekRep: RegularTaskWeekExtendedRepository,
        regularTaskViewRep: RegularTaskViewExtendedRepository,
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        weekId: number
    }, thunkApi) => {
        await regularTaskWeekRep.recoverRegTaskWeek(weekId)

        await thunkApi.dispatch(fetchReloadRegTasks({ regularTaskViewRep }))
        await thunkApi.dispatch(fetchReloadActualTasks({ actualTaskViewRep }))
    },
)

export { createRegTaskWeek, findAnyOneRegTask, recoverRegTaskWeek, removeRegTaskWeek, updateRegTaskWeek }

