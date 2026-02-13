import { Period, RegularTask, RegularTaskModel, RegularTaskWeek } from '@entities/regular-tasks'

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
        return {
            id: item.id,
            time: item.time,
            beginDate: item.beginDate,
            endDate: item.endDate,
            period: item.period,
            periodParam: item.periodParam,
            periodSize: item.periodSize,
            title: item.title,
            isImportant: item.isImportant,
            isUrgent: item.isUrgent,
            createdAt: item.createdAt,
            updateAt: item.updateAt,
            deletedAt: item.deletedAt,
            regularTaskWeekId: item.week?.id,
            su: item.week?.suRegularTaskId == null, //number | undefined | null,
            mo: item.week?.moRegularTaskId == null, //number | undefined | null,
            tu: item.week?.tuRegularTaskId == null, //number | undefined | null,
            we: item.week?.weRegularTaskId == null, //number | undefined | null,
            th: item.week?.thRegularTaskId == null, //number | undefined | null,
            fr: item.week?.frRegularTaskId == null, //number | undefined | null,
            sa: item.week?.saRegularTaskId == null, //number | undefined | null
        } satisfies RegularTaskModel as RegularTaskModel
    },
    mapToEntity(params: { model: RegularTaskModel, rt?: RegularTask, weekDay?: number }): RegularTask {
        let rt = params.rt ?? new RegularTask()
        const { model, weekDay } = params

        rt = {
            ...rt,
            ...model,
            id: rt.id,
            periodParam: model.period === 'everyWeek'
                ? calcPeriodParam(model.period, model.periodSize, model.beginDate, weekDay)
                : calcPeriodParam(model.period, model.periodSize),
        } as RegularTask

        return rt
    },
    mapToEntityWeekDay(weekDayIsActive: boolean, weekDay: number, model: RegularTaskModel, rt: RegularTask | null): RegularTask | null {
        //need to remove
        let entity: RegularTask | null = null

        if (!!weekDayIsActive && !!rt) {
            //need to update
            entity = mapper.mapToEntity({ model, rt, weekDay })
        }
        else if (!!weekDayIsActive && rt === null) {
            //need to create
            entity = mapper.mapToEntity({ model, weekDay })
        }

        return entity
    },
    mapToIds(rtw: RegularTaskWeek): number[] {
        let regTaskIds: number[] = []

        !!rtw.su && regTaskIds.push(rtw.su.id)
        !!rtw.mo && regTaskIds.push(rtw.mo.id)
        !!rtw.tu && regTaskIds.push(rtw.tu.id)
        !!rtw.we && regTaskIds.push(rtw.we.id)
        !!rtw.th && regTaskIds.push(rtw.th.id)
        !!rtw.fr && regTaskIds.push(rtw.fr.id)
        !!rtw.sa && regTaskIds.push(rtw.sa.id)

        return regTaskIds
    },
}
