
import { dateHelper } from '@shared/lib/helpers'
import { ActualTaskModel } from '../actual-tasks'
import { RegularTaskView } from './types/regular-task-view.entity'
import { Period, RegularTask } from './types/regular-task.entity'
import { RegularTaskModel } from './types/regular-task.model'


function calcPeriodParam(period: Period, periodSize: number): string {
    switch (period) {
        case 'everyDay': {
            return `+${periodSize} day`
        }
        case 'everyWeek': {
            return `+7 day`
        }
        case 'everyMonth': {
            return `+${periodSize} month`
        }
        case 'everyYear': {
            return `+${periodSize} year`
        }
        default:
            throw new Error(`No case for period ${period}`)
    }
}

export const mapper = {
    mapToModel(item: RegularTask): RegularTaskModel {
        const weekDays = item.week?.weekDays

        return {
            id: item.id,
            time: item.time,
            beginDate: item.beginDate,
            endDate: item.endDate,
            period: item.period,
            periodParam: item.periodParam,
            periodSize: item.periodSize,
            title: item.title,
            weekDay: item.weekDay,
            isImportant: item.isImportant,
            isUrgent: item.isUrgent,
            createdAt: item.createdAt,
            updateAt: item.updateAt,
            deletedAt: item.deletedAt,
            weekId: item.week?.id,
            su: !!weekDays ? weekDays.findIndex(i => i.weekDay === 0) >= 0 : false,
            mo: !!weekDays ? weekDays.findIndex(i => i.weekDay === 1) >= 0 : false,
            tu: !!weekDays ? weekDays.findIndex(i => i.weekDay === 2) >= 0 : false,
            we: !!weekDays ? weekDays.findIndex(i => i.weekDay === 3) >= 0 : false,
            th: !!weekDays ? weekDays.findIndex(i => i.weekDay === 4) >= 0 : false,
            fr: !!weekDays ? weekDays.findIndex(i => i.weekDay === 5) >= 0 : false,
            sa: !!weekDays ? weekDays.findIndex(i => i.weekDay === 6) >= 0 : false,
        } satisfies RegularTaskModel as RegularTaskModel
    },
    mapRegTaskViewToModel(item: RegularTaskView): RegularTaskModel {
        return {
            id: item.id,
            time: item.time,
            beginDate: item.beginDate,
            endDate: item.endDate,
            period: item.period,
            periodParam: item.periodParam,
            periodSize: item.periodSize,
            title: item.title,
            weekDay: null,
            isImportant: item.isImportant,
            isUrgent: item.isUrgent,
            createdAt: item.createdAt,
            updateAt: item.updateAt,
            deletedAt: item.deletedAt,
            weekId: item.weekId,
            su: item.su,
            mo: item.mo,
            tu: item.tu,
            we: item.we,
            th: item.th,
            fr: item.fr,
            sa: item.sa,
        } satisfies RegularTaskModel as RegularTaskModel
    },
    mapToEntity(params: { model: RegularTaskModel, rt?: RegularTask }): RegularTask {
        //only for days, months and years
        const { model } = params
        let { rt } = params
        rt = rt ?? new RegularTask()

        rt = {
            ...rt,
            ...model,
            id: rt.id,
            weekId: null,
            weekDay: null,
            beginDate: model.beginDate,
            periodParam: calcPeriodParam(model.period, model.periodSize),
        } as RegularTask

        return rt
    },
    mapWeekDayToEntity(model: RegularTaskModel, weekDay: number, rt?: RegularTask): RegularTask {
        //only for weeks
        let r = rt ?? new RegularTask()

        r = {
            ...r,
            ...model,
            id: r.id,
            weekId: model.weekId,
            weekDay: weekDay,
            beginDate: dateHelper.getNearestDate(model.beginDate, weekDay), //calculated for each week day (and week beginDate saved in RegularTasksWeek table)
            periodParam: calcPeriodParam(model.period, model.periodSize),
        } as RegularTask

        return r
    },
    mapToEntityWeekDay(weekDayIsActive: boolean, weekDay: number, model: RegularTaskModel, oldWeekDays: RegularTask[],
        newWeekDays: RegularTask[]): RegularTask[] {
        //only for weeks, change regularTaskWeek.weekDays
        const rt = oldWeekDays.find(i => i.weekDay === weekDay) ?? null

        if (!!weekDayIsActive && !!rt) {
            //need to update
            newWeekDays.push(mapper.mapWeekDayToEntity(model, weekDay, rt))
        }
        else if (!!weekDayIsActive && rt === null) {
            //need to create
            newWeekDays.push(mapper.mapWeekDayToEntity(model, weekDay))
        }
        //else need to remove, and its well be skipped

        return newWeekDays
    },

    //-----------------------------------------------------------
    mapModelToActualTaskModel(model: RegularTaskModel): ActualTaskModel {
        return {
            id: `0-${model.id}-0-${model.beginDate}`,
            isFirstGen: `true ${model.period}`,

            time: model.time,
            date: model.beginDate,

            title: model.title,

            regularTaskId: model.id,
            taskId: null,
            regularTasksResultId: null,

            weekDay: model.weekDay,
            periodParam: model.periodParam,
            period: model.period,
            periodSize: model.periodSize,

            isImportant: model.isImportant,
            isUrgent: model.isUrgent,

            createdAt: model.createdAt,
            updateAt: model.updateAt,
            deletedAt: model.deletedAt,

            beginDate: null,
            endDate: null,

            status: 'todo',
            pagingDateFrom: null,
            pagingDateTo: null
        } as ActualTaskModel satisfies ActualTaskModel
    },
}
