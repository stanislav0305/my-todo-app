import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { INITIAL_ACTUAL_TASKS_STATE } from '../constants'
import { mapper } from '../mapper'
import { ActualTaskColumnsShow } from '../types/actual-task-columns-show'
import { ActualTaskPagingPeriodModel } from '../types/actual-task-paging-period.model'
import { ActualTaskPaging } from '../types/actual-task-paging.entity'
import { ActualTaskView } from '../types/actual-task-view.entity'
import { ActualTaskModel } from '../types/actual-task.model'
import { ActualTasksFilterModeType } from '../types/actual-tasks-filter-mode-type'
import { ActualTaskPagingModel } from '../types/actual-tasks-paging.model'
import { ActualTaskPagingExtendedRepository } from './actual-task-paging.extended.repository'
import { ActualTaskViewExtendedRepository } from './actual-task-view.extended.repository'


export const actualTasksSlice = createSlice({
    name: 'actualTasksSlice',
    initialState: INITIAL_ACTUAL_TASKS_STATE,
    extraReducers: builder =>
        builder.addCase(revertAll, () => INITIAL_ACTUAL_TASKS_STATE),
    reducers: {
        resetMany: (draftState, action: PayloadAction<{ actualTasks: ActualTaskModel[], paging: ActualTaskPagingModel }>) => {
            const { actualTasks, paging } = action.payload

            draftState.items = [...actualTasks]
            draftState.paging = paging
        },
        appendMany: (draftState, action: PayloadAction<{ actualTasks: ActualTaskModel[], paging: ActualTaskPagingModel }>) => {
            const { actualTasks, paging } = action.payload

            draftState.items = [...draftState.items, ...actualTasks]
            draftState.paging = paging
        },
        resetPaging: (draftState, action: PayloadAction<{ paging: ActualTaskPagingModel }>) => {
            const { paging } = action.payload
            draftState.paging = paging
        },
        resetPagingPeriod: (draftState, action: PayloadAction<ActualTaskPagingPeriodModel>) => {
            const pagingPeriod = { ...action.payload }
            draftState.pagingPeriod = pagingPeriod
        },
        update: (draftState, action: PayloadAction<ActualTaskModel>) => {
            const item = { ...action.payload }
            const index = draftState.items.findIndex(i => i.id === item.id)

            if (index >= 0) {
                draftState.items[index] = {
                    ...draftState.items[index],
                    ...item,
                } satisfies ActualTaskModel
            }
        },
        remove: (draftState, action: PayloadAction<string>) => {
            const id = action.payload

            const itemExist = draftState.items.findIndex(i => i.id === id) >= 0
            if (itemExist) {
                draftState.items = draftState.items.filter(i => i.id !== id)
                draftState.paging.skip--
                draftState.paging.itemCount--
            }
        },
        removeMany: (draftState, action: PayloadAction<string[]>) => {
            const ids = action.payload

            const newItems = draftState.items.filter(i => !ids.includes(i.id))
            const removedCount = draftState.items.length - newItems.length

            draftState.items = [...newItems]
            draftState.paging.skip = draftState.paging.skip -= removedCount
            draftState.paging.itemCount -= removedCount
        },
    },
})

export const { appendMany, resetMany, resetPaging, resetPagingPeriod, update, remove, removeMany } = actualTasksSlice.actions
//export { resetPaging }
export const actualTasksReducers = actualTasksSlice.reducer

const fetchActualTasks = createAsyncThunk(
    'actualTasks/fetch',
    async ({ actualTaskViewRep, paging, fetchType, columnsShow, filter, }: {
        actualTaskViewRep: ActualTaskViewExtendedRepository,
        paging: ActualTaskPagingModel,
        fetchType: FetchTasksTypes,
        columnsShow: ActualTaskColumnsShow | null,
        filter: DbFilter<ActualTaskView, ActualTasksFilterModeType> | null
    }, thunkApi) => {
        console.log('actualTasks/fetch...')

        const mp = actualTaskViewRep.mapPagingBefore(paging, fetchType, columnsShow, filter)
        if (!mp.hasNext) {
            console.log(`actualTasks/fetch stopped (hasNext:${mp.hasNext})`)
            return
        }

        const [models, modelCount] = await actualTaskViewRep.fetchRegTasks(mp.paging)
        const newP = actualTaskViewRep.mapPagingAfter(mp.paging, modelCount)

        if (newP.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(resetMany({ actualTasks: models, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendMany({ actualTasks: models, paging: newP }))

        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

//--------------------------------------------------------

/*
const createRegTask = createAsyncThunk(
    'regularTasks/createRegTask',
    async ({ regularTaskRep, model }: { regularTaskRep: RegularTaskExtendedRepository, model: RegularTaskModel }) => {
        await regularTaskRep.createRegTask(model)
    },
)

const updateRegTask = createAsyncThunk(
    'regularTasks/updateRegTask',
    async ({ regularTaskRep, regularTaskWeekRep, model, oldWeekId }: { 
    regularTaskRep: RegularTaskExtendedRepository, 
    regularTaskWeekRep: RegularTaskWeekExtendedRepository, 
    model: RegularTaskModel, oldWeekId: number | null | undefined 
    }, thunkApi) => {
        const m = await regularTaskRep.updateRegTask(regularTaskWeekRep, model, oldWeekId)
        thunkApi.dispatch(update(m))
    },
)

const removeRegTask = createAsyncThunk(
    'regularTasks/removeRegTask',
    async ({ regularTaskRep, id, softRemove }: { 
    regularTaskRep: RegularTaskExtendedRepository, 
    id: number, 
    softRemove: boolean 
    }, thunkApi) => {
        softRemove && await regularTaskRep.softRemoveRegTask(id)
        !softRemove && await regularTaskRep.removeRegTask(id)

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
*/
//export { createRegTask, fetchRegTasks, removeRegTask, restoreRegTask, updateRegTask }
export { fetchActualTasks }

/*
//--------------------------------------------------------

const createRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/createRegTask',
    async ({ regularTaskWeekRep, model }: { regularTaskWeekRep: RegularTaskWeekExtendedRepository, model: RegularTaskModel }) => {
        await regularTaskWeekRep.createRegTaskWeek(model)
    },
)

const updateRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/updateRegTask',
    async ({ regularTaskWeekRep, regularTaskRep, model, oldWeekId }: { 
    regularTaskWeekRep: RegularTaskWeekExtendedRepository, 
    regularTaskRep: RegularTaskExtendedRepository, 
    model: RegularTaskModel, 
    oldWeekId: number | null | undefined }, thunkApi) => {
        await regularTaskWeekRep.updateRegTaskWeek(regularTaskRep, model, oldWeekId)
    },
)

const removeRegTaskWeek = createAsyncThunk(
    'regularTasksWeek/removeRegTask',
    async ({ regularTaskWeekRep, id, softRemove }: { 
    regularTaskWeekRep: RegularTaskWeekExtendedRepository, 
    id: number, 
    softRemove: boolean 
    }, thunkApi) => {
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
*/

//-------------------------------------------------------
//-------------------------------------------------------
const actualTaskPagingInit = createAsyncThunk(
    'actualTaskPaging/init',
    async ({ actualTaskPagingRep }: { actualTaskPagingRep: ActualTaskPagingExtendedRepository }, thunkApi) => {
        const entity: ActualTaskPaging = await actualTaskPagingRep.getTopOne()
        const model = mapper.mapActualTaskPagingToActualTaskPagingPeriodModel(entity)
        thunkApi.dispatch(resetPagingPeriod(model))
    }
)

/*
const actualTaskPagingGet = createAsyncThunk(
    'actualTaskPaging/get',
    async ({ actualTaskPagingRep }: { actualTaskPagingRep: ActualTaskPagingExtendedRepository }, thunkApi) => {
        const entity: ActualTaskPaging = await actualTaskPagingRep.getTopOne()
        const pagingPeriod = mapper.mapActualTaskPagingToActualTaskPagingPeriodModel(entity)
        thunkApi.dispatch(resetPagingPeriod(pagingPeriod))
    },
)
*/
const actualTaskPagingUpdate = createAsyncThunk(
    'actualTaskPaging/update',
    async ({ actualTaskPagingRep, pagingPeriodModel }: {
        actualTaskPagingRep: ActualTaskPagingExtendedRepository,
        pagingPeriodModel: ActualTaskPagingPeriodModel
    }, thunkApi) => {
        let entity = mapper.mapActualTaskPagingPeriodModelToActualTaskPaging(pagingPeriodModel)
        entity = await actualTaskPagingRep.updateTopOne(entity)
        const pagingPeriod = mapper.mapActualTaskPagingToActualTaskPagingPeriodModel(entity)
        thunkApi.dispatch(resetPagingPeriod(pagingPeriod))
    },
)

export { actualTaskPagingInit, actualTaskPagingUpdate }

