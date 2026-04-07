import { fieldHelper } from '@/__tests__/test-utils/field-helper'
import { setupTestAppDataSource } from '@/__tests__/test-utils/test-app-data-source-helper'
import { testDataHelper } from '@/__tests__/test-utils/test-data-helper'
import { mapper } from '@/src/entities/regular-tasks/mapper'
import { RegularTask, regularTaskExtendedRepository, RegularTaskExtendedRepository, RegularTaskModel, RegularTaskWeek, regularTaskWeekExtendedRepository, RegularTaskWeekExtendedRepository } from '@entities/regular-tasks'
import { dateHelper } from '@shared/lib/helpers'
import { act } from 'react'
import { DataSource } from 'typeorm'


describe('createRegTaskWeek', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('create reg task week - with all week days', async () => {
        const weekActiveDayCount = 7
        const su = true, mo = true, tu = true, we = true, th = true, fr = true, sa = true

        await testCreateRegTaskWeek(weekActiveDayCount, su, mo, tu, we, th, fr, sa)
    })

    it('create reg task week - with monday', async () => {
        const weekActiveDayCount = 1
        const su = false, mo = true, tu = false, we = false, th = false, fr = false, sa = false

        await testCreateRegTaskWeek(weekActiveDayCount, su, mo, tu, we, th, fr, sa)
    })

    it('create reg task week - with sunday and saturday', async () => {
        const weekActiveDayCount = 2
        const su = true, mo = false, tu = false, we = false, th = false, fr = false, sa = true

        await testCreateRegTaskWeek(weekActiveDayCount, su, mo, tu, we, th, fr, sa)
    })

    it('create reg task week - with monday, tuesday, wednesday, thursday and friday', async () => {
        const weekActiveDayCount = 5
        const su = false, mo = true, tu = true, we = true, th = true, fr = true, sa = false

        await testCreateRegTaskWeek(weekActiveDayCount, su, mo, tu, we, th, fr, sa)
    })

    async function testCreateRegTaskWeek(weekActiveDayCount: number, su: boolean, mo: boolean, tu: boolean, we: boolean, th: boolean, fr: boolean, sa: boolean) {
        const regTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        const model = testDataHelper.genRegTaskModelWeekForCreate(su, mo, tu, we, th, fr, sa)

        const created: RegularTaskWeek = await act(async () => {
            return regTaskWeekRep.createRegTaskWeek(model)
        })

        // Has id
        expect(created.id).toBeDefined()

        // Has contain creating data
        expect(created.beginDate).toEqual(model.beginDate)

        //---------------------------------------

        const weekId = created.id
        const [regTaskWeekItems, regTaskWeekItemCount] = await regTaskWeekRep.findAndCount()

        //RegularTaskWeeks table has 1 item
        expect(regTaskWeekItemCount).toEqual(1)
        //Id value check
        expect(regTaskWeekItems[0].id).toEqual(weekId)

        //RegularTasks table item count = weekActiveDayCount
        const [regTasItems, regTaskItemCount] = await regTaskRep.findAndCount({ relations: { week: true } })
        expect(regTaskItemCount).toEqual(weekActiveDayCount)

        //all dais has correct weekId
        const index = regTasItems.findIndex(i => i.weekId != weekId)
        expect(index).toEqual(-1)

        //check each week day
        su && dayExistAndIsCorrect(regTasItems, 0, weekId, model) //su
        mo && dayExistAndIsCorrect(regTasItems, 1, weekId, model) //mo
        tu && dayExistAndIsCorrect(regTasItems, 2, weekId, model) //tu
        we && dayExistAndIsCorrect(regTasItems, 3, weekId, model) //we
        th && dayExistAndIsCorrect(regTasItems, 4, weekId, model) //th
        fr && dayExistAndIsCorrect(regTasItems, 5, weekId, model) //fr
        sa && dayExistAndIsCorrect(regTasItems, 6, weekId, model) //sa
    }
})

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

describe('updateRegTaskWeek', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('update reg task week', async () => {
        const regTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        let weekActiveDayCount = 7
        let su = true, mo = true, tu = true, we = true, th = true, fr = true, sa = true
        const modelForCreate = testDataHelper.genRegTaskModelWeekForCreate(su, mo, tu, we, th, fr, sa)
        const rtw: RegularTaskWeek = await regTaskWeekRep.createRegTaskWeek(modelForCreate)

        //get monday id
        let moId = rtw.weekDays.find(d => d.weekDay === 1)!.id
        let modelForUpdate = mapper.mapToModel(await regTaskRep.findOneRegTaskWithWeekDays(moId, true))

        weekActiveDayCount = 5
        su = false
        sa = false
        modelForUpdate = testDataHelper.genRegTaskModelWeekForUpdate(modelForUpdate, su, mo, tu, we, th, fr, sa)

        await act(async () => {
            return await regTaskWeekRep.updateRegTaskWeek(regTaskRep, modelForUpdate, rtw.id)
        })
        //get any week day with it week days
        const w = await regTaskRep.findOneRegTaskWithWeekDays(moId, true)
        const updated: RegularTaskModel = mapper.mapToModel(w)

        // Has id
        expect(updated.id).toBeDefined()
        expect(updated.weekId).toBeDefined()

        // id not changed
        expect(updated.id).toEqual(modelForUpdate.id)

        // Has contain creating data
        const u = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(updated)
        const fu = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskModel>(modelForUpdate)
        expect(u).toEqual(fu)

        //---------------------------------------

        const weekId = updated.weekId!
        const [regTaskWeekItems, regTaskWeekItemCount] = await regTaskWeekRep.findAndCount()

        //RegularTaskWeeks table has 1 item
        expect(regTaskWeekItemCount).toEqual(1)
        //Id value check
        expect(regTaskWeekItems[0].id).toEqual(weekId)

        //RegularTasks table item count = weekActiveDayCount
        const [regTasItems, regTaskItemCount] = await regTaskRep.findAndCount({ relations: { week: true } })
        expect(regTaskItemCount).toEqual(weekActiveDayCount)

        //all dais has correct weekId
        const index = regTasItems.findIndex(i => i.weekId != weekId)
        expect(index).toEqual(-1)

        //check each week day
        su && dayExistAndIsCorrect(regTasItems, 0, weekId, modelForUpdate) //su
        mo && dayExistAndIsCorrect(regTasItems, 1, weekId, modelForUpdate) //mo
        tu && dayExistAndIsCorrect(regTasItems, 2, weekId, modelForUpdate) //tu
        we && dayExistAndIsCorrect(regTasItems, 3, weekId, modelForUpdate) //we
        th && dayExistAndIsCorrect(regTasItems, 4, weekId, modelForUpdate) //th
        fr && dayExistAndIsCorrect(regTasItems, 5, weekId, modelForUpdate) //fr
        sa && dayExistAndIsCorrect(regTasItems, 6, weekId, modelForUpdate) //sa
    })
})

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

describe('softRemoveRegTaskWeek', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('soft remove reg task week', async () => {
        const regTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        let weekActiveDayCount = 7
        let su = true, mo = true, tu = true, we = true, th = true, fr = true, sa = true
        const modelForCreate = testDataHelper.genRegTaskModelWeekForCreate(su, mo, tu, we, th, fr, sa)
        const createdWeek: RegularTaskWeek = await regTaskWeekRep.createRegTaskWeek(modelForCreate)

        const [rtwSoftRemoved, dayIds] = await act(async () => {
            return await regTaskWeekRep.softRemoveRegTaskWeek(createdWeek.id)
        })
        const removedWeek = await regTaskWeekRep.findOneRegTaskWeek(createdWeek.id, true)

        // Has id
        expect(createdWeek.id).toBeDefined()
        expect(rtwSoftRemoved.id).toBeDefined()

        // Created and removed task data equal
        const c = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskWeek>(createdWeek)
        c.weekDays = []
        const r = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskWeek>(removedWeek)
        r.weekDays = []
        expect(c).toEqual(r)

        //---------------------------------------
        //regTaskWeek
        //---------------------------------------

        const weekId = createdWeek.id
        const regTaskWeekItemCount = await regTaskWeekRep.count()

        //RegularTaskWeeks table has 1 item
        expect(regTaskWeekItemCount).toEqual(0)

        const [regTaskWeekItems2, regTaskWeekItemCount2] = await regTaskWeekRep.findAndCount({ withDeleted: true })
        // Table item count, with deleted, is 1 
        expect(regTaskWeekItemCount2).toEqual(1)

        //Id value check
        expect(regTaskWeekItems2[0].id).toEqual(weekId)


        let itemCount = await regTaskRep.count()
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)

        //---------------------------------------
        //regTasks
        //---------------------------------------

        itemCount = await regTaskRep.count()
        // Table item count, with deleted, is weekActiveDayCount 
        expect(itemCount).toEqual(0)

        const [regTaskDays, dayCount] = await regTaskRep.findAndCount({ withDeleted: true })
        // Table item count, with deleted, is weekActiveDayCount 
        expect(dayCount).toEqual(weekActiveDayCount)

        //all dais has correct weekId
        const index = regTaskDays.findIndex(i => i.weekId != weekId)
        expect(index).toEqual(-1)

        //check each week day
        su && dayExistAndIsCorrect(regTaskDays, 0, weekId, modelForCreate) //su
        mo && dayExistAndIsCorrect(regTaskDays, 1, weekId, modelForCreate) //mo
        tu && dayExistAndIsCorrect(regTaskDays, 2, weekId, modelForCreate) //tu
        we && dayExistAndIsCorrect(regTaskDays, 3, weekId, modelForCreate) //we
        th && dayExistAndIsCorrect(regTaskDays, 4, weekId, modelForCreate) //th
        fr && dayExistAndIsCorrect(regTaskDays, 5, weekId, modelForCreate) //fr
        sa && dayExistAndIsCorrect(regTaskDays, 6, weekId, modelForCreate) //sa
    })
})

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

describe('removeRegTaskWeek', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('full remove not soft removed reg task week', async () => {
        const regTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        let su = true, mo = true, tu = true, we = true, th = true, fr = true, sa = true
        const modelForCreate = testDataHelper.genRegTaskModelWeekForCreate(su, mo, tu, we, th, fr, sa)
        const createdWeek: RegularTaskWeek = await regTaskWeekRep.createRegTaskWeek(modelForCreate)

        await act(async () => {
            return await regTaskWeekRep.removeRegTaskWeek(createdWeek.id)
        })

        const regTaskWeekItemCount2 = await regTaskWeekRep.count({ withDeleted: true })
        // Table item count, with deleted, is 0 
        expect(regTaskWeekItemCount2).toEqual(0)


        let itemCount = await regTaskRep.count({ withDeleted: true })
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)
    })

    it('full remove soft removed reg task week', async () => {
        const regTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        let su = true, mo = true, tu = true, we = true, th = true, fr = true, sa = true
        const modelForCreate = testDataHelper.genRegTaskModelWeekForCreate(su, mo, tu, we, th, fr, sa)
        const createdWeek: RegularTaskWeek = await regTaskWeekRep.createRegTaskWeek(modelForCreate)
        const [softRemovedWeek,] = await regTaskWeekRep.softRemoveRegTaskWeek(createdWeek.id)

        await act(async () => {
            return await regTaskWeekRep.removeRegTaskWeek(softRemovedWeek.id)
        })

        const regTaskWeekItemCount2 = await regTaskWeekRep.count({ withDeleted: true })
        // Table item count, with deleted, is 0 
        expect(regTaskWeekItemCount2).toEqual(0)

        let itemCount = await regTaskRep.count({ withDeleted: true })
        // Table item count, without deleted, is 0 
        expect(itemCount).toEqual(0)
    })
})

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

describe('recoverRegTaskWeek', () => {
    let dataSource: DataSource

    beforeEach(async () => {
        dataSource = await setupTestAppDataSource()
    })

    afterEach(() => {
        dataSource.destroy()
    })

    it('recovery soft removed reg task week', async () => {
        const regTaskWeekRep: RegularTaskWeekExtendedRepository = dataSource.getRepository(RegularTaskWeek)
            .extend(regularTaskWeekExtendedRepository)
        const regTaskRep: RegularTaskExtendedRepository = dataSource.getRepository(RegularTask)
            .extend(regularTaskExtendedRepository)

        let weekActiveDayCount = 7
        let su = true, mo = true, tu = true, we = true, th = true, fr = true, sa = true
        const modelForCreate = testDataHelper.genRegTaskModelWeekForCreate(su, mo, tu, we, th, fr, sa)
        const createdWeek: RegularTaskWeek = await regTaskWeekRep.createRegTaskWeek(modelForCreate)

        const [rtwRecovered,] = await act(async () => {
            return await regTaskWeekRep.recoverRegTaskWeek(createdWeek.id)
        })
        const recoveredWeek = await regTaskWeekRep.findOneRegTaskWeek(rtwRecovered.id, true)

        // Has id
        expect(createdWeek.id).toBeDefined()
        expect(rtwRecovered.id).toBeDefined()

        // Created and removed task data equal
        const c = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskWeek>(createdWeek)
        c.weekDays = []
        const r = fieldHelper.excludeFieldsDatesAtAndId<RegularTaskWeek>(recoveredWeek)
        r.weekDays = []
        expect(c).toEqual(r)

        //---------------------------------------
        //regTaskWeek
        //---------------------------------------

        const weekId = createdWeek.id
        const regTaskWeekItemCount = await regTaskWeekRep.count()

        //RegularTaskWeeks table has 1 item
        expect(regTaskWeekItemCount).toEqual(1)

        const [regTaskWeekItems2, regTaskWeekItemCount2] = await regTaskWeekRep.findAndCount({ withDeleted: true })
        // Table item count, with deleted, is 1 
        expect(regTaskWeekItemCount2).toEqual(1)

        //Id value check
        expect(regTaskWeekItems2[0].id).toEqual(weekId)

        //---------------------------------------
        //regTasks
        //---------------------------------------

        let itemCount = await regTaskRep.count()
        // Table item count, with deleted, is weekActiveDayCount 
        expect(itemCount).toEqual(weekActiveDayCount)

        const [regTaskDays, dayCount] = await regTaskRep.findAndCount({ withDeleted: true })
        // Table item count, with deleted, is weekActiveDayCount 
        expect(dayCount).toEqual(weekActiveDayCount)

        //all dais has correct weekId
        const index = regTaskDays.findIndex(i => i.weekId != weekId)
        expect(index).toEqual(-1)

        //check each week day
        su && dayExistAndIsCorrect(regTaskDays, 0, weekId, modelForCreate) //su
        mo && dayExistAndIsCorrect(regTaskDays, 1, weekId, modelForCreate) //mo
        tu && dayExistAndIsCorrect(regTaskDays, 2, weekId, modelForCreate) //tu
        we && dayExistAndIsCorrect(regTaskDays, 3, weekId, modelForCreate) //we
        th && dayExistAndIsCorrect(regTaskDays, 4, weekId, modelForCreate) //th
        fr && dayExistAndIsCorrect(regTaskDays, 5, weekId, modelForCreate) //fr
        sa && dayExistAndIsCorrect(regTaskDays, 6, weekId, modelForCreate) //sa
    })
})

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

function dayExistAndIsCorrect(regTasItems: RegularTask[], weekDay: number, weekId: number, model: RegularTaskModel) {
    const day = regTasItems.find(i => i.weekDay === weekDay)

    //week day exist
    expect(day).toBeTruthy()

    //day data is correct
    expect(day!.time).toEqual(model.time)
    expect(day!.beginDate).toEqual(dateHelper.getNearestDate(model.beginDate, weekDay))
    expect(day!.endDate).toEqual(model.endDate)

    expect(day!.period).toEqual('everyWeek')
    expect(day!.periodSize).toEqual(model.periodSize)

    expect(day!.title).toEqual(model.title)

    expect(day!.isImportant).toEqual(model.isImportant)
    expect(day!.isUrgent).toEqual(model.isUrgent)

    expect(day!.weekDay).toEqual(weekDay)
    expect(day!.weekId).toEqual(weekId)
}