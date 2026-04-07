import { RegularTask, RegularTaskModel } from '@entities/regular-tasks'
import { calcPeriodParam, mapper } from '@entities/regular-tasks/mapper'
import { Task } from '@entities/tasks'
import { dateHelper, timeHelper } from '@shared/lib/helpers'


export const testDataHelper = {
    genTaskForCreate: () => {
        const t: Task = new Task()
        t.time = timeHelper.toFormattedString(new Date(), 'hh:mm')
        t.date = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')
        t.title = 'test task 1'
        t.status = 'todo'
        t.isImportant = true
        t.isUrgent = true

        return t
    },
    genTaskForUpdate: (baseTask: Task) => {
        const t = { ...baseTask }
        t.time = timeHelper.toFormattedStringOrEmpty({ hours: 10, minutes: 30 }, 'hh:mm')
        t.date = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')
        t.title = 'test task 222'
        t.status = 'done'
        t.isImportant = false
        t.isUrgent = false

        return t
    },
    //-------------------------------------------------------------------
    genRegTaskForCreate: (period: 'everyDay' | 'everyMonth' | 'everyYear') => {
        const rt: RegularTask = new RegularTask()

        rt.time = timeHelper.toFormattedString(new Date(), 'hh:mm')
        rt.beginDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')
        rt.endDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')

        rt.period = period
        rt.periodSize = 1
        rt.periodParam = calcPeriodParam(rt.period, rt.periodSize)

        rt.title = 'test task 1'

        rt.isImportant = true
        rt.isUrgent = true

        rt.week = null
        rt.weekDay = null
        rt.weekId = null

        return rt as RegularTask
    },
    genRegTaskModelForCreate: (period: 'everyDay' | 'everyMonth' | 'everyYear') => {
        const rt: RegularTask = testDataHelper.genRegTaskForCreate(period)

        const rtm = mapper.mapToModel(rt)
        return { ...rtm } as RegularTaskModel
    },
    genRegTaskModelForUpdate(rt: RegularTask, period: 'everyDay' | 'everyMonth' | 'everyYear'): RegularTaskModel {
        let t = { ...rt }
        t.time = timeHelper.toFormattedString(new Date(), 'hh:mm')
        t.beginDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')
        t.endDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')

        t.period = period
        t.periodSize = 2
        t.periodParam = calcPeriodParam(t.period, t.periodSize)

        t.title = 'test task 222'

        t.isImportant = false
        t.isUrgent = false

        t.weekDay = null
        t.weekId = null

        const rtm = mapper.mapToModel(t)
        return rtm as RegularTaskModel
    },
    //-------------------------------------------------------------------
    genRegTaskModelWeekForCreate: (su: boolean, mo: boolean, tu: boolean, we: boolean, th: boolean, fr: boolean, sa: boolean) => {
        const rtm = new RegularTaskModel()
        rtm.time = timeHelper.toFormattedString(new Date(), 'hh:mm')
        rtm.beginDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')
        rtm.endDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')

        rtm.period = 'everyWeek'
        rtm.periodSize = 1
        //rtm.periodParam = //calcPeriodParam(rt.period, rt.periodSize)

        rtm.title = 'test task 1'

        rtm.isImportant = true
        rtm.isUrgent = true

        rtm.weekDay = null
        rtm.weekId = null

        rtm.su = su
        rtm.mo = mo
        rtm.tu = tu
        rtm.we = we
        rtm.th = th
        rtm.fr = fr
        rtm.sa = sa

        return rtm
    },
    genRegTaskModelWeekForUpdate: (rtm: RegularTaskModel, su: boolean, mo: boolean, tu: boolean, we: boolean, th: boolean, fr: boolean, sa: boolean) => {
        let m = { ...rtm }
        m.time = timeHelper.toFormattedString(new Date(), 'hh:mm')
        m.beginDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')
        m.endDate = dateHelper.toFormattedString(new Date(), 'YYYY-MM-DD')

        m.period = 'everyWeek'
        m.periodSize = 2

        m.title = 'test task 2'

        m.isImportant = false
        m.isUrgent = false

        m.su = su
        m.mo = mo
        m.tu = tu
        m.we = we
        m.th = th
        m.fr = fr
        m.sa = sa

        return m as RegularTaskModel
    },
}

