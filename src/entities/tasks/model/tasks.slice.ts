import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { Paging } from '@shared/lib/types'
import { FindManyOptions, Repository } from 'typeorm'
import { INITIAL_TASKS_STATE, TASK_TAKE_ITEMS_COUNT } from '../constants'
import { Task } from '../types/task'


export const tasksSlice = createSlice({
    name: 'tasksSlice',
    initialState: INITIAL_TASKS_STATE,
    extraReducers: (builder) => builder.addCase(revertAll, () => INITIAL_TASKS_STATE),
    reducers: {
        setTasks: (draftState, action: PayloadAction<{ tasks: Task[], paging: Paging<Task> }>) => {
            const { tasks, paging } = action.payload

            draftState.items = [...tasks]
            draftState.paging = paging
        },
        appendTasks: (draftState, action: PayloadAction<{ tasks: Task[], paging: Paging<Task> }>) => {
            const { tasks, paging } = action.payload

            draftState.items = [...draftState.items, ...tasks]
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
                    ...item
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

const { appendTasks, setTasks, update, remove } = tasksSlice.actions
export const tasksReducers = tasksSlice.reducer


const fetchTasks = createAsyncThunk(
    'tasks/fetch',
    async ({ taskRep, paging }:
        { taskRep: Repository<Task>, paging: Paging<Task> }, thunkApi) => {
        console.log('tasks/fetch...')

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
            console.log(`tasks/fetch stopped (paging.hasNext:${paging.hasNext})`)
            return
        }

        console.log('tasks/fetch begin')
        const [items, itemCount] = await taskRep.findAndCount({
            skip: paging.skip,
            take: paging.take,
            where: paging.where,
            order: paging.order,
        } as FindManyOptions<Task>)


        if (paging.fetchType === 'fetchFromBeginToSkipped') {
            paging.skip = paging.take
            paging.take = TASK_TAKE_ITEMS_COUNT
        }

        paging.itemCount = itemCount
        paging.hasPrevious = paging.skip > 0
        paging.hasNext = paging.skip < paging.itemCount

        if (paging.fetchType === 'fetchFromBegin' || paging.fetchType === 'fetchFromBeginToSkipped')
            thunkApi.dispatch(setTasks({ tasks: items, paging }))
        else if (paging.fetchType === 'fetchNext')
            thunkApi.dispatch(appendTasks({ tasks: items, paging }))

    })

const createTask = createAsyncThunk(
    'tasks/createTask',
    async ({ taskRep, item }: { taskRep: Repository<Task>, item: Task }, thunkApi) => {
        let t = new Task()
        t = {
            ...t,
            ...item,
            id: t.id
        }

        await taskRep.save(t)
        //const i = await taskRep.save(t)
        // thunkApi.dispatch(create(i))

        //need reload, because maybe in list not loaded all existed tasks 
        // => can't insert new created tasks to sorted task list, because it maybe is'nt full loaded
        const state = thunkApi.getState() as RootState
        const paging = JSON.parse(JSON.stringify(state.tasks.paging)) as Paging<Task>
        paging.hasNext = true
        paging.fetchType = 'fetchFromBeginToSkipped'

        thunkApi.dispatch(await fetchTasks({ taskRep, paging }))
    })

const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskRep, item }: { taskRep: Repository<Task>, item: Task }, thunkApi) => {
        let t = await taskRep.findOneBy({ id: item.id, })
        t = {
            ...t,
            ...item,
        }
        const i = await taskRep.save(t)
        thunkApi.dispatch(update(i))
    })

const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async ({ taskRep, id }: { taskRep: Repository<Task>, id: number }, thunkApi) => {

        const taskToRemove = await taskRep.findOneBy({ id: id, })
        if (taskToRemove != null) {
            await taskRep.remove(taskToRemove)
            thunkApi.dispatch(remove(id))
        }
    })

export { createTask, fetchTasks, removeTask, updateTask }

