import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm'
import { TASK_TAKE_ITEMS_COUNT } from '../constants'
import { TaskColumnsShow } from '../types/task-columns-show'
import { Task } from '../types/task.entity'
import { TasksFilterModeType } from '../types/tasks-filter-mode-type'
import { TaskPaging } from '../types/tasks-paging'


export interface TaskExtendedRepository extends Repository<Task> {
    mapPagingBefore(paging: TaskPaging, fetchType: FetchTasksTypes, columnsShow: TaskColumnsShow | null,
        filter: DbFilter<Task, TasksFilterModeType> | null): { paging: TaskPaging, hasNext: boolean }
    mapPagingAfter(paging: TaskPaging, itemCount: number): TaskPaging
    fetchTasks(paging: TaskPaging): Promise<[Task[], number]>
    findOneTask(id: number, withDeleted: boolean | undefined): Promise<Task>
    createTask(item: Task): Promise<Task>
    updateTask(item: Task): Promise<[boolean, Task]>
    softRemoveTask(id: number): Promise<Task>
    removeTask(id: number): Promise<Task>
    restoreTask(id: number): Promise<UpdateResult>
}

export const taskExtendedRepository: TaskExtendedRepository = {
    mapPagingBefore(paging: TaskPaging, fetchType: FetchTasksTypes, columnsShow: TaskColumnsShow | null,
        filter: DbFilter<Task, TasksFilterModeType> | null): { paging: TaskPaging, hasNext: boolean } {
        const hasNext = fetchType === 'fetchFromBegin' ? true : paging.hasNext
        if (!hasNext) {
            return { paging: paging, hasNext: hasNext }
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

        return { paging: p, hasNext: hasNext }
    },
    mapPagingAfter(paging: TaskPaging, itemCount: number): TaskPaging {
        let p = Object.assign({}, paging)

        p.skip = p.skip + TASK_TAKE_ITEMS_COUNT
        p.itemCount = itemCount
        p.hasPrevious = p.skip > 0
        p.hasNext = p.skip < p.itemCount

        return p
    },
    fetchTasks(this: Repository<Task>, paging: TaskPaging): Promise<[Task[], number]> {
        return this.findAndCount({
            where: paging.filter.where,
            withDeleted: paging.filter.withDeleted,
            order: paging.order,
            skip: paging.skip,
            take: paging.take,
        } as FindManyOptions<Task>)
    },
    async findOneTask(id: number, withDeleted: boolean | undefined): Promise<Task> {
        const t = await this.findOne({
            where: { id } as FindOptionsWhere<Task>,
            withDeleted: withDeleted,
        } as FindOneOptions<Task>)

        return t!
    },
    createTask(item: Task): Promise<Task> { //this: Repository<Task>,
        let t = new Task()
        t = {
            ...t,
            ...item,
            id: t.id,
        }

        return this.save(t)
    },
    async updateTask(item: Task): Promise<[boolean, Task]> {
        let t = await this.findOneBy({ id: item.id })
        const needListReload = t == null || !item.id || item.time !== t.time || item.date !== t.date

        t = {
            ...t,
            ...item,
        }

        return [needListReload, await this.save(t)]
    },

    async softRemoveTask(id: number): Promise<Task> {
        //can remove only not soft removed
        const taskToRemove = await this.findOneTask(id, false)
        return await this.softRemove(taskToRemove!)
    },

    async removeTask(id: number): Promise<Task> {
        //can remove soft removed and not
        const taskToRemove = await this.findOneTask(id, true)
        return await this.remove(taskToRemove!)
    },

    async restoreTask(id: number): Promise<UpdateResult> {
        return await this.restore(id)
    },
} as TaskExtendedRepository satisfies TaskExtendedRepository