import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { removeTaskFromState, revertAll, updateTaskInState } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { Task } from '../../tasks'
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
        builder
            .addCase(revertAll, () => INITIAL_ACTUAL_TASKS_STATE)
            .addCase(updateTaskInState, (draftState, action: PayloadAction<Task>) => {
                console.log(`${action.type} actualTasksSlice`, action.payload)

                const item = action.payload
                const index = draftState.items.findIndex(i => i.taskId === item.id)

                if (index >= 0) {
                    const oldModel = { ...draftState.items[index] }
                    const newMode: ActualTaskModel = mapper.mapTaskToActualTaskModel(oldModel, item)

                    draftState.items[index] = {
                        ...draftState.items[index],
                        ...newMode,
                    } satisfies ActualTaskModel
                }
            })
            .addCase(removeTaskFromState, (draftState, action: PayloadAction<number>) => {
                const taskId = action.payload

                const itemExist = draftState.items.findIndex(i => i.taskId === taskId) >= 0
                if (itemExist) {
                    draftState.items = draftState.items.filter(i => i.taskId !== taskId)
                    draftState.paging.skip--
                    draftState.paging.itemCount--
                }
            }),
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
    },
})
export const { appendMany, resetMany, resetPaging, resetPagingPeriod } = actualTasksSlice.actions

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

        const [models, modelCount] = await actualTaskViewRep.fetchActualTasks(mp.paging)
        const newP = actualTaskViewRep.mapPagingAfter(mp.paging, modelCount)

        if (newP.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(resetMany({ actualTasks: models, paging: newP }))
        else if (newP.fetchType === 'fetchNext')
            thunkApi.dispatch(appendMany({ actualTasks: models, paging: newP }))

        console.log(`fetchMore end (hasNext:${newP.hasNext}, skip:${newP.skip})`)
    },
)

const fetchReloadActualTasks = createAsyncThunk(
    'actualTasks/fetchReload',
    async ({ actualTaskViewRep }: { actualTaskViewRep: ActualTaskViewExtendedRepository }, thunkApi) => {
        console.log('tasks/fetch...')

        const state = thunkApi.getState() as RootState

        const reloadPaging: ActualTaskPagingModel = { ...state.actualTasks.paging }
        reloadPaging.take = reloadPaging.skip
        reloadPaging.skip = 0

        const [items, itemCount] = await actualTaskViewRep.fetchActualTasks(reloadPaging)
        thunkApi.dispatch(resetMany({ actualTasks: items, paging: state.actualTasks.paging }))

        console.log(`fetchReload end (loaded row count:${itemCount}, before reload row count ${reloadPaging.itemCount})`)
    },
)

//--------------------------------------------------------

export { fetchActualTasks, fetchReloadActualTasks }


const actualTaskPagingInit = createAsyncThunk(
    'actualTaskPaging/init',
    async ({ actualTaskPagingRep }: { actualTaskPagingRep: ActualTaskPagingExtendedRepository }, thunkApi) => {
        const entity: ActualTaskPaging = await actualTaskPagingRep.getTopOne()
        const model = mapper.mapActualTaskPagingToActualTaskPagingPeriodModel(entity)
        thunkApi.dispatch(resetPagingPeriod(model))
    }
)

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

