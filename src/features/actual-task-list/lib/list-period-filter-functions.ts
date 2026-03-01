import { ActualTaskDatesPeriod, ActualTaskPagingPeriodModel } from '@entities/actual-tasks'
import { dateHelper } from '@shared/lib/helpers'


export function getDefaultDates(period: ActualTaskDatesPeriod) {
    let dateFrom: Date
    let dateTo: Date

    switch (period) {
        case 'byDay': {
            dateFrom = new Date()
            dateTo = new Date()
            break
        }
        case 'byWeek': {
            const d = new Date()
            const dStr = dateHelper.toFormattedString(d, 'YYYY-MM-DD')
            const range = dateHelper.getWeekBeginAndEndDates(dStr)
            dateFrom = range.weekBegin
            dateTo = range.weekEnd
            break
        }
        case 'byMonth': {
            const d = new Date()
            const dStr = dateHelper.toFormattedString(d, 'YYYY-MM-DD')
            const range = dateHelper.getMonthBeginAndEndDates(dStr)
            dateFrom = range.monthBegin
            dateTo = range.monthEnd
            break
        }
        default: {
            throw new Error('Not implemented code')
        }
    }

    return {
        dateFrom: dateHelper.toFormattedString(dateFrom, 'YYYY-MM-DD'),
        dateTo: dateHelper.toFormattedString(dateTo, 'YYYY-MM-DD'),
        period
    } as ActualTaskPagingPeriodModel
}

export function changeDates(model: ActualTaskPagingPeriodModel, increase: boolean) {
    let dateFrom: Date
    let dateTo: Date

    switch (model.period) {
        case 'byDay': {
            const shift = increase ? 1 : -1
            dateFrom = dateHelper.addDays(model.dateFrom, shift)
            dateTo = new Date(dateFrom)

            break
        }
        case 'byWeek': {
            const shift = increase ? 7 : -7
            dateFrom = dateHelper.addDays(model.dateFrom, shift)
            dateTo = dateHelper.addDays(model.dateTo, shift)

            break
        }
        case 'byMonth': {
            dateFrom = dateHelper.changeMonth(model.dateFrom, increase)
            dateTo = dateHelper.getEndOfMonth(dateFrom)
            break
        }
        default: {
            throw new Error('Not implemented code')
        }
    }

    let newMode = { ...model }
    newMode.dateFrom = dateHelper.toFormattedString(dateFrom, 'YYYY-MM-DD')
    newMode.dateTo = dateHelper.toFormattedString(dateTo, 'YYYY-MM-DD')

    return newMode
}