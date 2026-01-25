import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { INITIAL_REGULAR_TASKS_STATE, REGULAR_TASK_TAKE_ITEMS_COUNT } from '../constants'
import { RegularTask } from '../types/regular-task'
import { RegularTaskColumnsShow } from '../types/regular-task-columns-show'
import { RegularTasksFilterModeType } from '../types/regular-tasks-filter-mode-type'
import { RegularTaskPaging } from '../types/regular-tasks-paging'

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
    async (
        {
            regularTaskRep,
            paging,
            fetchType,
            columnsShow,
            filter,
        }: {
            regularTaskRep: Repository<RegularTask>
            paging: RegularTaskPaging
            fetchType: FetchTasksTypes
            columnsShow: RegularTaskColumnsShow | null
            filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null
        },
        thunkApi,
    ) => {
        console.log('regularTasks/fetch...')

        const hasNext = fetchType === 'fetchFromBegin' ? true : paging.hasNext
        if (!hasNext) {
            console.log(`regularTasks/fetch stopped (hasNext:${hasNext})`)
            return
        }

        let p = Object.assign({}, paging)
        p = {
            ...p,
            fetchType,
            filter: filter ?? p.filter,
            columnsShow: columnsShow ?? p.columnsShow,
            itemCount: fetchType === 'fetchFromBegin' ? 0 : p.itemCount,
            skip: fetchType === 'fetchFromBegin' ? 0 : p.skip,
            hasNext: hasNext,
            hasPrevious: fetchType === 'fetchFromBegin' ? false : p.hasPrevious,
        }

        console.log('regularTasks/fetch begin')
        const [items, itemCount] = await regularTaskRep.findAndCount({
            where: p.filter.where,
            withDeleted: p.filter.withDeleted,
            order: p.order,
            skip: p.skip,
            take: p.take,
        } as FindManyOptions<RegularTask>)

        p.skip = p.skip + REGULAR_TASK_TAKE_ITEMS_COUNT
        p.itemCount = itemCount
        p.hasPrevious = p.skip > 0
        p.hasNext = p.skip < p.itemCount

        if (p.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(setRegTasks({ regularTasks: items, paging: p }))
        else if (p.fetchType === 'fetchNext')
            thunkApi.dispatch(appendRegTasks({ regularTasks: items, paging: p }))

        console.log(`fetchMore end (hasNext:${p.hasNext}, skip:${p.skip})`)
    },
)

const createRegTask = createAsyncThunk(
    'regularTasks/createRegTask',
    async (
        { regularTaskRep, item }: { regularTaskRep: Repository<RegularTask>; item: RegularTask }) => {
        let t = new RegularTask()
        t = {
            ...t,
            ...item,
            id: t.id,
        }
        await regularTaskRep.save(t)
    },
)

const updateRegTask = createAsyncThunk(
    'regularTasks/updateRegTask',
    async (
        {
            regularTaskRep,
            item,
        }: { regularTaskRep: Repository<RegularTask>; item: RegularTask },
        thunkApi,
    ) => {
        let rt = await regularTaskRep.findOneBy({ id: item.id })
        rt = {
            ...rt,
            ...item,
        }
        const i = await regularTaskRep.save(rt)

        thunkApi.dispatch(update(i))
    },
)

const removeRegTask = createAsyncThunk(
    'regularTasks/removeRegTask',
    async (
        {
            regularTaskRep,
            id,
            softRemove,
        }: {
            regularTaskRep: Repository<RegularTask>
            id: number
            softRemove: boolean
        },
        thunkApi,
    ) => {
        const findOpts = { id } as FindOptionsWhere<RegularTask>

        if (softRemove) {
            const taskToRemove = await regularTaskRep.findOneBy(findOpts)
            await regularTaskRep.softRemove(taskToRemove!)
        } else {
            const taskToRemove = await regularTaskRep.findOne({
                where: findOpts,
                withDeleted: true,
            } as FindOneOptions<RegularTask>)
            await regularTaskRep.remove(taskToRemove!)
        }

        thunkApi.dispatch(remove(id))
    },
)

export { createRegTask, fetchRegTasks, removeRegTask, setRegPaging, updateRegTask }

