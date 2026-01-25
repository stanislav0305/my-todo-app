import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import {
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    Repository,
} from 'typeorm'
import { INITIAL_TASKS_STATE, TASK_TAKE_ITEMS_COUNT } from '../constants'
import { Task } from '../types/task'
import { TaskColumnsShow } from '../types/task-columns-show'
import { TasksFilterModeType } from '../types/tasks-filter-mode-type'
import { TaskPaging } from '../types/tasks-paging'

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
    async (
        {
            taskRep,
            paging,
            fetchType,
            columnsShow,
            filter,
        }: {
            taskRep: Repository<Task>
            paging: TaskPaging
            fetchType: FetchTasksTypes
            columnsShow: TaskColumnsShow | null
            filter: DbFilter<Task, TasksFilterModeType> | null
        },
        thunkApi,
    ) => {
        console.log('tasks/fetch...')

        const hasNext = fetchType === 'fetchFromBegin' ? true : paging.hasNext
        if (!hasNext) {
            console.log(`tasks/fetch stopped (hasNext:${hasNext})`)
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

        console.log('tasks/fetch begin')
        const [items, itemCount] = await taskRep.findAndCount({
            where: p.filter.where,
            withDeleted: p.filter.withDeleted,
            order: p.order,
            skip: p.skip,
            take: p.take,
        } as FindManyOptions<Task>)

        p.skip = p.skip + TASK_TAKE_ITEMS_COUNT
        p.itemCount = itemCount
        p.hasPrevious = p.skip > 0
        p.hasNext = p.skip < p.itemCount

        if (p.fetchType === 'fetchFromBegin')
            thunkApi.dispatch(setTasks({ tasks: items, paging: p }))
        else if (p.fetchType === 'fetchNext')
            thunkApi.dispatch(appendTasks({ tasks: items, paging: p }))

        console.log(`fetchMore end (hasNext:${p.hasNext}, skip:${p.skip})`)
    },
)

const createTask = createAsyncThunk(
    'tasks/createTask',
    async ({ taskRep, item }: { taskRep: Repository<Task>; item: Task }) => {
        let t = new Task()
        t = {
            ...t,
            ...item,
            id: t.id,
        }

        await taskRep.save(t)
    },
)

const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (
        { taskRep, item }: { taskRep: Repository<Task>; item: Task },
        thunkApi,
    ) => {
        let t = await taskRep.findOneBy({ id: item.id })
        t = {
            ...t,
            ...item,
        }
        const i = await taskRep.save(t)

        thunkApi.dispatch(update(i))
    },
)

const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (
        {
            taskRep,
            id,
            softRemove,
        }: { taskRep: Repository<Task>; id: number; softRemove: boolean },
        thunkApi,
    ) => {
        const findOpts = { id } as FindOptionsWhere<Task>

        if (softRemove) {
            const taskToRemove = await taskRep.findOneBy(findOpts)
            await taskRep.softRemove(taskToRemove!)
        } else {
            const taskToRemove = await taskRep.findOne({
                where: findOpts,
                withDeleted: true,
            } as FindOneOptions<Task>)
            await taskRep.remove(taskToRemove!)
        }

        thunkApi.dispatch(remove(id))
    },
)

export { createTask, fetchTasks, removeTask, setPaging, updateTask }

