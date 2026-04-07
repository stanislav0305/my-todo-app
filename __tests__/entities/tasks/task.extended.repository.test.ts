
import { fieldHelper } from '@/__tests__/test-utils/field-helper'
import { setupTestAppDataSource } from '@/__tests__/test-utils/test-app-data-source-helper'
import { testDataHelper } from '@/__tests__/test-utils/test-data-helper'
import { Task, taskExtendedRepository, TaskExtendedRepository } from '@entities/tasks'
import { act } from 'react'
import { DataSource } from 'typeorm'


describe('createTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('create task', async () => {
        const taskRep: TaskExtendedRepository = dataSource.getRepository(Task).extend(taskExtendedRepository)
        const item = testDataHelper.genTaskForCreate()

        const funResult = await act(async () => {
            return taskRep.createTask({ ...item })
        })

        // Has id
        expect(funResult.id).toBeDefined()

        // Has contain creating data
        const result = fieldHelper.excludeFieldsDatesAtAndId<Task>(funResult)
        expect(result).toEqual(item)

        //---------------------------------------

        const [items, itemCount] = await taskRep.findAndCount()

        //Table has 1 item
        expect(itemCount).toEqual(1)

        // Has contain creating data
        const result2 = fieldHelper.excludeFieldsDatesAtAndId<Task>(items[0])
        expect(result2).toEqual(item)
    })
})

describe('updateTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('update task', async () => {
        const taskRep: TaskExtendedRepository = dataSource.getRepository(Task).extend(taskExtendedRepository)
        const t = testDataHelper.genTaskForCreate()
        const tsf = await taskRep.save(t)
        const forUpdate = testDataHelper.genTaskForUpdate(tsf)

        const [, updatedTask] = await act(async () => {
            return taskRep.updateTask({ ...forUpdate })
        })

        // Has id
        expect(updatedTask.id).toBeDefined()

        // id not changed
        expect(updatedTask.id).toEqual(forUpdate.id)

        // Has contain creating data
        const fr = fieldHelper.excludeFieldsDatesAtAndId<Task>(updatedTask)
        const sr = fieldHelper.excludeFieldsDatesAtAndId<Task>(forUpdate)
        expect(fr).toEqual(sr)

        //---------------------------------------

        const [items, itemCount] = await taskRep.findAndCount()

        //Table has 1 item
        expect(itemCount).toEqual(1)

        //Contain updated data
        const result2 = fieldHelper.excludeFieldsDatesAtAndId<Task>(items[0])
        expect(result2).toEqual(sr)
    })
})

describe('softRemoveTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('soft remove', async () => {
        const taskRep: TaskExtendedRepository = dataSource.getRepository(Task).extend(taskExtendedRepository)
        const t = testDataHelper.genTaskForCreate()
        const tsf = await taskRep.save(t)

        const removedTask = await act(async () => {
            return taskRep.softRemoveTask(tsf.id)
        })

        // Created and removed task data equal
        const fr = fieldHelper.excludeFieldsDatesAtAndId<Task>(t)
        const rt = fieldHelper.excludeFieldsDatesAtAndId<Task>(removedTask)
        expect(fr).toEqual(rt)


        //---------------------------------------
        let itemCount = await taskRep.count()
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)

        itemCount = await taskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 1 
        expect(itemCount).toEqual(1)
    })
})

describe('removeTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('full remove not soft removed task', async () => {
        const taskRep: TaskExtendedRepository = dataSource.getRepository(Task).extend(taskExtendedRepository)
        const t = testDataHelper.genTaskForCreate()
        const tsf = await taskRep.save(t)

        const removedTask = await act(async () => {
            return taskRep.removeTask(tsf.id)
        })

        // Created and removed task data equal
        const fr = fieldHelper.excludeFieldsDatesAtAndId<Task>(t)
        const rt = fieldHelper.excludeFieldsDatesAtAndId<Task>(removedTask)
        expect(fr).toEqual(rt)


        //---------------------------------------
        let itemCount = await taskRep.count()
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)

        itemCount = await taskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 0
        expect(itemCount).toEqual(0)
    })


    it('full remove soft removed task', async () => {
        const taskRep: TaskExtendedRepository = dataSource.getRepository(Task).extend(taskExtendedRepository)
        const t = testDataHelper.genTaskForCreate()
        const tsf = await taskRep.save(t)
        await taskRep.softRemove(tsf)

        const removedTask = await act(async () => {
            return taskRep.removeTask(tsf.id)
        })

        // Created and removed task data equal
        const fr = fieldHelper.excludeFieldsDatesAtAndId<Task>(t)
        const rt = fieldHelper.excludeFieldsDatesAtAndId<Task>(removedTask)
        expect(fr).toEqual(rt)


        //---------------------------------------
        let itemCount = await taskRep.count()
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)

        itemCount = await taskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 0
        expect(itemCount).toEqual(0)
    })
})

describe('restoreTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('restore task', async () => {
        const taskRep: TaskExtendedRepository = dataSource.getRepository(Task).extend(taskExtendedRepository)
        const t = testDataHelper.genTaskForCreate()
        const tsf = await taskRep.save(t)
        await taskRep.softRemove({ ...tsf })

        await act(async () => {
            return taskRep.restoreTask(tsf.id)
        })

        //---------------------------------------
        let count = await taskRep.count()

        // Table item count, without deleted, is 0 
        expect(count).toEqual(1)

        count = await taskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 1
        expect(count).toEqual(1)

        const [items, itemCount] = await taskRep.findAndCount()

        // Table has 1 item
        expect(itemCount).toEqual(1)

        // Item contain all created data after restore
        const f = fieldHelper.excludeFieldsDatesAtAndId<Task>(tsf)
        const i = fieldHelper.excludeFieldsDatesAtAndId<Task>(items[0])
        expect(i).toEqual(f)
    })
})
