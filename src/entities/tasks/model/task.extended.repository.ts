import { DbFilter, FetchTasksTypes } from '@shared/lib/types'
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { TASK_TAKE_ITEMS_COUNT } from '../constants'
import { Task } from '../types/task'
import { TaskColumnsShow } from '../types/task-columns-show'
import { TasksFilterModeType } from '../types/tasks-filter-mode-type'
import { TaskPaging } from '../types/tasks-paging'


export interface TaskExtendedRepository extends Repository<Task> {
    mapPagingBefore(paging: TaskPaging, fetchType: FetchTasksTypes, columnsShow: TaskColumnsShow | null,
        filter: DbFilter<Task, TasksFilterModeType> | null): { paging: TaskPaging, hasNext: boolean }
    mapPagingAfter(paging: TaskPaging, itemCount: number): TaskPaging
    fetchTasks(paging: TaskPaging): Promise<[Task[], number]>
    createTask(this: Repository<Task>, item: Task): Promise<Task>
    updateTask(this: Repository<Task>, item: Task): Promise<Task>
    removeTask(this: Repository<Task>, id: number, softRemove: boolean): Promise<Task>
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
    createTask(this: Repository<Task>, item: Task): Promise<Task> {
        let t = new Task()
        t = {
            ...t,
            ...item,
            id: t.id,
        }

        return this.save(t)
    },
    async updateTask(this: Repository<Task>, item: Task): Promise<Task> {
        let t = await this.findOneBy({ id: item.id })
        t = {
            ...t,
            ...item,
        }

        return this.save(t)
    },
    async removeTask(this: Repository<Task>, id: number, softRemove: boolean): Promise<Task> {
        const findOpts = { id } as FindOptionsWhere<Task>

        if (softRemove) {
            const taskToRemove = await this.findOneBy(findOpts)
            return this.softRemove(taskToRemove!)
        } else {
            const taskToRemove = await this.findOne({
                where: findOpts,
                withDeleted: true,
            } as FindOneOptions<Task>)

            return this.remove(taskToRemove!)
        }
    }
} as TaskExtendedRepository