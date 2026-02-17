import { Period, RegularTask, RegularTaskModel, RegularTaskView } from '@entities/regular-tasks'


function calcPeriodParam(period: Period, periodSize: number, beginDate?: string, dayOfWeekNum?: number): string {
    switch (period) {
        case 'everyDay': {
            return `+ ${periodSize} day`
        }
        case 'everyWeek': {
            return `+ (${periodSize} * 7 - strftime('%w', ${beginDate}) + ${dayOfWeekNum}) day`
        }
        case 'everyMonth': {
            return `+ ${periodSize} month`
        }
        case 'everyYear': {
            return `+ ${periodSize} year`
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
        const { model } = params
        let { rt } = params
        rt = rt ?? new RegularTask()

        rt = {
            ...rt,
            ...model,
            id: rt.id,
            weekId: model.period === 'everyWeek' ? model.weekId : null, //if not week then clear weekId
            weekDay: model.period === 'everyWeek' ? model.weekDay : null, //if not week then clear weekDay
            periodParam: model.period === 'everyWeek'
                ? calcPeriodParam(model.period, model.periodSize, model.beginDate, model.weekDay!)
                : calcPeriodParam(model.period, model.periodSize),
        } as RegularTask

        return rt
    },
    mapToEntityWeekDay(weekDayIsActive: boolean, weekDay: number, model: RegularTaskModel, oldWeekDays: RegularTask[],
        newWeekDays: RegularTask[]): RegularTask[] {
        const rt = oldWeekDays.find(i => i.weekDay === weekDay) ?? null

        if (!!weekDayIsActive && !!rt) {
            //need to update
            newWeekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: weekDay }, rt }))
        }
        else if (!!weekDayIsActive && rt === null) {
            //need to create
            newWeekDays.push(mapper.mapToEntity({ model: { ...model, weekDay: weekDay } }))
        }
        //else need to remove, and its well be skipped

        return newWeekDays
    },
}
