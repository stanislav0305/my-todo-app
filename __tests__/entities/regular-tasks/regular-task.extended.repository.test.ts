import { fieldHelper } from '@/__tests__/test-utils/field-helper'
import { setupTestAppDataSource } from '@/__tests__/test-utils/test-app-data-source-helper'
import { testDataHelper } from '@/__tests__/test-utils/test-data-helper'
import { mapper } from '@/src/entities/regular-tasks/mapper'
import { RegularTask, regularTaskExtendedRepository, RegularTaskExtendedRepository, RegularTaskModel, RegularTaskWeek, regularTaskWeekExtendedRepository, RegularTaskWeekExtendedRepository } from '@entities/regular-tasks'
import { act } from 'react'
import { DataSource } from 'typeorm'


describe('createRegTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('create reg task with period - everyDay', async () => {
        const model = testDataHelper.genRegTaskModelForCreate('everyDay')
        await testCreateRegTask(model)
    })

    it('create reg task with period - everyMonth', async () => {
        const model = testDataHelper.genRegTaskModelForCreate('everyMonth')
        await testCreateRegTask(model)
    })

    it('create reg task with period - everyYear', async () => {
        const model = testDataHelper.genRegTaskModelForCreate('everyYear')
        await testCreateRegTask(model)
    })

    async function testCreateRegTask(model: RegularTaskModel) {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        const funResult = await act(async () => {
            return regTaskRep.createRegTask({ ...model })
        })

        // Has id
        expect(funResult.id).toBeDefined()

        // Has contain creating data
        const funResultData = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(funResult)
        const mData = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(model)
        expect(funResultData).toEqual(mData)

        //---------------------------------------

        const [items, itemCount] = await regTaskRep.findAndCount()
        //Table has 1 item
        expect(itemCount).toEqual(1)

        // Has contain creating data
        const model2 = mapper.mapToModel(items[0])
        const modelData2 = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(model2)
        const funResultData2 = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(funResult)

        expect(modelData2).toEqual(funResultData2)
    }

})

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

describe('updateRegTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('update reg task with period - everyDay, what was created with period - everyDay', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)
        const regularTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyDay')
        const rts = await regTaskRep.save(rt)
        const forUpdate = testDataHelper.genRegTaskModelForUpdate(rts, 'everyDay')

        await testUpdateRegTask(regTaskRep, regularTaskWeekRep, forUpdate)
    })

    it('update reg task with period - everyMonth, what was created with period - everyMonth', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)
        const regularTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyMonth')
        const rts = await regTaskRep.save(rt)
        const forUpdate = testDataHelper.genRegTaskModelForUpdate(rts, 'everyMonth')

        await testUpdateRegTask(regTaskRep, regularTaskWeekRep, forUpdate)
    })

    it('update reg task with period - everyYear, what was created with period - everyYear', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)
        const regularTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyYear')
        const rts = await regTaskRep.save(rt)
        const forUpdate = testDataHelper.genRegTaskModelForUpdate(rts, 'everyYear')

        await testUpdateRegTask(regTaskRep, regularTaskWeekRep, forUpdate)
    })

    //-----------------------------------------------------------------------

    it('update reg task with period - everyMonth, what was created with period - everyDay', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)
        const regularTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyDay')
        const rts = await regTaskRep.save(rt)
        const forUpdate = testDataHelper.genRegTaskModelForUpdate(rts, 'everyMonth')

        await testUpdateRegTask(regTaskRep, regularTaskWeekRep, forUpdate)
    })

    it('update reg task with period - everyYear, what was created with period - everyMonth', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)
        const regularTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyMonth')
        const rts = await regTaskRep.save(rt)
        const forUpdate = testDataHelper.genRegTaskModelForUpdate(rts, 'everyYear')

        await testUpdateRegTask(regTaskRep, regularTaskWeekRep, forUpdate)
    })

    it('update reg task with period - everyDay, what was created with period - everyYear', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)
        const regularTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyYear')
        const rts = await regTaskRep.save(rt)
        const forUpdate = testDataHelper.genRegTaskModelForUpdate(rts, 'everyDay')

        await testUpdateRegTask(regTaskRep, regularTaskWeekRep, forUpdate)
    })

    async function testUpdateRegTask(regTaskRep: RegularTaskExtendedRepository, regularTaskWeekRep: RegularTaskWeekExtendedRepository,
        forUpdate: RegularTaskModel) {
        const [, updatedRegTask] = await act(async () => {
            return regTaskRep.updateRegTask(regularTaskWeekRep, { ...forUpdate }, null)
        })

        // Has id
        expect(updatedRegTask.id).toBeDefined()

        // id not changed
        expect(updatedRegTask.id).toEqual(forUpdate.id)

        // Has contain creating data
        const updatedData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(updatedRegTask)
        const forUpdateData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(forUpdate)
        expect(updatedData).toEqual(forUpdateData)

        //---------------------------------------

        const [items, itemCount] = await regTaskRep.findAndCount()

        //Table has 1 item
        expect(itemCount).toEqual(1)

        //Contain updated data
        const model2 = mapper.mapToModel(items[0])
        const modelData2 = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(model2)
        const funResultData2 = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(updatedRegTask)
        expect(modelData2).toEqual(funResultData2)
    }
})

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

describe('softRemoveRegTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('soft remove', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyDay')
        const forRemove = await regTaskRep.save(rt)

        const removed = await act(async () => {
            return regTaskRep.softRemoveRegTask(forRemove.id)
        })

        // Created and removed task data equal
        const forRemoveData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(forRemove)
        const removedData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(removed)
        expect(forRemoveData).toEqual(removedData)

        //---------------------------------------
        let itemCount = await regTaskRep.count()
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)

        itemCount = await regTaskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 1 
        expect(itemCount).toEqual(1)
    })
})

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

describe('removeTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('full remove not soft removed reg task', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyDay')
        const forRemove = await regTaskRep.save(rt)

        const removed = await act(async () => {
            return regTaskRep.removeRegTask(forRemove.id)
        })

        // Created and removed task data equal
        const forRemoveData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(forRemove)
        const removedData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(removed)
        expect(forRemoveData).toEqual(removedData)

        //---------------------------------------

        const itemCount = await regTaskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 0 
        expect(itemCount).toEqual(0)
    })

    it('full remove soft removed reg task', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyDay')
        const forRemove = await regTaskRep.save(rt)
        const softRemoved = await regTaskRep.softRemove(forRemove)

        const removed = await act(async () => {
            return regTaskRep.removeRegTask(softRemoved.id)
        })

        // Created and removed task data equal
        const softRemovedData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(softRemoved)
        const removedData = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(removed)
        expect(softRemovedData).toEqual(removedData)

        //---------------------------------------

        const itemCount = await regTaskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 0 
        expect(itemCount).toEqual(0)
    })
})

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

describe('restoreTask', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('restore reg task', async () => {
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        const rt = testDataHelper.genRegTaskForCreate('everyDay')
        const forRemove = await regTaskRep.save(rt)
        const softRemoved = await regTaskRep.softRemove({ ...forRemove })

        await act(async () => {
            return regTaskRep.restoreRegTask(softRemoved.id)
        })

        //---------------------------------------
        let count = await regTaskRep.count()

        // Table item count, without deleted, is 1
        expect(count).toEqual(1)

        count = await regTaskRep.count({ withDeleted: true })
        // Table item count, with deleted, is 1
        expect(count).toEqual(1)

        const [items, itemCount] = await regTaskRep.findAndCount({ relations: { week: true } })

        // Table has 1 item
        expect(itemCount).toEqual(1)

        // Item contain all created data after restore
        const f = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(forRemove)
        const i = fieldHelper.excludeFieldsDatesAtAndId<RegularTask>(items[0])
        expect(i).toEqual(f)
    })
})
