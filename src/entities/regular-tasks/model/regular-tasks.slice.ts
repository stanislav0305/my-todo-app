import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { Paging } from '@shared/lib/types'
import { FindManyOptions, Repository } from 'typeorm'
import { INITIAL_REGULAR_TASKS_STATE, REGULAR_TASK_TAKE_ITEMS_COUNT } from '../constants'
import { RegularTask } from '../types/regular-task'


export const regularTasksSlice = createSlice({
    name: 'regularTasksSlice',
    initialState: INITIAL_REGULAR_TASKS_STATE,
    extraReducers: (builder) => builder.addCase(revertAll, () => INITIAL_REGULAR_TASKS_STATE),
    reducers: {
        setRegularTasks: (draftState, action: PayloadAction<{ regularTasks: RegularTask[], paging: Paging<RegularTask> }>) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...regularTasks]
            draftState.paging = paging
        },
        appendRegularTasks: (draftState, action: PayloadAction<{ regularTasks: RegularTask[], paging: Paging<RegularTask> }>) => {
            const { regularTasks, paging } = action.payload

            draftState.items = [...draftState.items, ...regularTasks]
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
                    ...item
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

const { appendRegularTasks, setRegularTasks, update, remove } = regularTasksSlice.actions
export const regularTasksReducers = regularTasksSlice.reducer


const fetchRegTasks = createAsyncThunk(
    'regularTasks/fetch',
    async ({ regularTaskRep, paging }:
        { regularTaskRep: Repository<RegularTask>, paging: Paging<RegularTask> }, thunkApi) => {
        console.log('regularTasks/fetch...')

        if (paging.fetchType === 'fetchFromBegin') {
            paging.skip = 0
            paging.hasNext = true
            paging.hasPrevious = false
        }
        else if (paging.fetchType === 'fetchNext') {
            paging.skip = paging.skip + paging.take
        }
        else if (paging.fetchType === 'fetchFromBeginToSkipped') {
            const oldSkip = paging.skip
            paging.skip = 0
            paging.take = oldSkip
            //paging.hasNext = true
            //paging.hasPrevious = false
        }

        if (!paging.hasNext) {
            console.log(`regularTasks/fetch stopped (paging.hasNext:${paging.hasNext})`)
            return
        }

        console.log('regularTasks/fetch begin')
        const [items, itemCount] = await regularTaskRep.findAndCount({
            skip: paging.skip,
            take: paging.take,
            where: paging.where,
            order: paging.order,
        } as FindManyOptions<RegularTask>)


        if (paging.fetchType === 'fetchFromBeginToSkipped') {
            paging.skip = paging.take
            paging.take = REGULAR_TASK_TAKE_ITEMS_COUNT
        }

        paging.itemCount = itemCount
        paging.hasPrevious = paging.skip > 0
        paging.hasNext = paging.skip < paging.itemCount

        if (paging.fetchType === 'fetchFromBegin' || paging.fetchType === 'fetchFromBeginToSkipped')
            thunkApi.dispatch(setRegularTasks({ regularTasks: items, paging }))
        else if (paging.fetchType === 'fetchNext')
            thunkApi.dispatch(appendRegularTasks({ regularTasks: items, paging }))
    })

const createRegTask = createAsyncThunk(
    'regularTasks/createRegTask',
    async ({ regularTaskRep, item }: { regularTaskRep: Repository<RegularTask>, item: RegularTask }, thunkApi) => {
        let t = new RegularTask()
        t = {
            ...t,
            ...item,
            id: t.id
        }

        await regularTaskRep.save(t)
        //const i = await regularTaskRep.save(t)
        // thunkApi.dispatch(create(i))

        //need reload, because maybe in list not loaded all existed regular tasks 
        // => can't insert new created regular tasks to sorted regular task list, because it maybe is'nt full loaded
        const state = thunkApi.getState() as RootState
        const paging = JSON.parse(JSON.stringify(state.regularTasks.paging)) as Paging<RegularTask>
        paging.hasNext = true
        paging.fetchType = 'fetchFromBeginToSkipped'

        thunkApi.dispatch(await fetchRegTasks({ regularTaskRep, paging }))
    })

const updateRegTask = createAsyncThunk(
    'regularTasks/updateRegTask',
    async ({ regularTaskRep, item }: { regularTaskRep: Repository<RegularTask>, item: RegularTask }, thunkApi) => {
        let rt = await regularTaskRep.findOneBy({ id: item.id, })
        rt = {
            ...rt,
            ...item,
        }
        const i = await regularTaskRep.save(rt)
        thunkApi.dispatch(update(i))
    })

const removeRegTask = createAsyncThunk(
    'regularTasks/removeRegTask',
    async ({ regularTaskRep, id }: { regularTaskRep: Repository<RegularTask>, id: number }, thunkApi) => {

        const taskToRemove = await regularTaskRep.findOneBy({ id: id, })
        if (taskToRemove != null) {
            await regularTaskRep.remove(taskToRemove)
            thunkApi.dispatch(remove(id))
        }
    })

export { createRegTask, fetchRegTasks, removeRegTask, updateRegTask }

