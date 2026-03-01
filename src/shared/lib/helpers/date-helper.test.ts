import { dateHelper } from './date-helper'


describe('getNearestDateShift', () => {
    it('Calc shift from Sunday-0 to Sunday-0 = 0 days', () => {
        expect(dateHelper.getNearestDateShift(0, 0)).toBe(0)
    })

    it('Calc shift from Monday-1 to Monday-1 = 0 days', () => {
        expect(dateHelper.getNearestDateShift(1, 1)).toBe(0)
    })

    //------------------------------------------------------

    it('Calc shift from Sunday-0 to Monday-1 = 1 days', () => {
        expect(dateHelper.getNearestDateShift(0, 1)).toBe(1)
    })

    it('Calc shift from Sunday-0 to Tuesday-2 = 2 days', () => {
        expect(dateHelper.getNearestDateShift(0, 2)).toBe(2)
    })

    it('Calc shift from Sunday-0 to Tuesday-2 = 6 days', () => {
        expect(dateHelper.getNearestDateShift(0, 6)).toBe(6)
    })

    //------------------------------------------------------

    it('Calc shift from Monday-1 to Sunday-0 = 6 days', () => {
        expect(dateHelper.getNearestDateShift(1, 0)).toBe(6)
    })

    it('Calc shift from Tuesday-2 to Sunday-0 = 5 days', () => {
        expect(dateHelper.getNearestDateShift(2, 0)).toBe(5)
    })

    it('Calc shift from Saturday-6 to Sunday-0 = 1 days', () => {
        expect(dateHelper.getNearestDateShift(6, 0)).toBe(1)
    })

    //------------------------------------------------------

    it('Calc shift from Saturday-6 to Wednesday-3 = 4 days', () => {
        expect(dateHelper.getNearestDateShift(6, 3)).toBe(4)
    })

    it('Calc shift from Saturday-6 to Friday-5 = 6 days', () => {
        expect(dateHelper.getNearestDateShift(6, 5)).toBe(6)
    })

})
//------------------------------------------------------
//------------------------------------------------------

describe('getNearestDate', () => {
    it('Get nearest Sunday-0 for 2026-02-15, it is 2026-02-15', () => {
        expect(dateHelper.getNearestDate('2026-02-15', 0)).toBe('2026-02-15')
    })

    it('Get nearest Monday-1 for 2026-02-15, it is 2026-02-16', () => {
        expect(dateHelper.getNearestDate('2026-02-15', 1)).toBe('2026-02-16')
    })

    it('Get nearest Tuesday-2 for 2026-02-15, it is 2026-02-17', () => {
        expect(dateHelper.getNearestDate('2026-02-15', 2)).toBe('2026-02-17')
    })

    it('Get nearest Wednesday-3 for 2026-02-15, it is 2026-02-18', () => {
        expect(dateHelper.getNearestDate('2026-02-15', 3)).toBe('2026-02-18')
    })

    it('Get nearest Saturday-6 for 2026-02-15, it is 2026-02-21', () => {
        expect(dateHelper.getNearestDate('2026-02-15', 6)).toBe('2026-02-21')
    })
})
//------------------------------------------------------
//------------------------------------------------------
describe('getWeekBeginAndEndDates', () => {
    it('For 2026-02-15 begin week is 2026-02-15 and end week is 2026-02-15', () => {
        const { weekBegin, weekEnd } = dateHelper.getWeekBeginAndEndDates('2026-02-15')

        expect(weekBegin.toISOString()).toEqual(new Date('2026-02-15').toISOString())
        expect(weekEnd.toISOString()).toEqual(new Date('2026-02-21').toISOString())
    })

    it('For 2026-02-17 begin week is 2026-02-15 and end week is 2026-02-15', () => {
        const { weekBegin, weekEnd } = dateHelper.getWeekBeginAndEndDates('2026-02-17')

        expect(weekBegin.toISOString()).toEqual(new Date('2026-02-15').toISOString())
        expect(weekEnd.toISOString()).toEqual(new Date('2026-02-21').toISOString())
    })

    it('For 2026-02-20 begin week is 2026-02-15 and end week is 2026-02-15', () => {
        const { weekBegin, weekEnd } = dateHelper.getWeekBeginAndEndDates('2026-02-20')

        expect(weekBegin.toISOString()).toEqual(new Date('2026-02-15').toISOString())
        expect(weekEnd.toISOString()).toEqual(new Date('2026-02-21').toISOString())
    })

    it('For 2026-02-21 begin week is 2026-02-15 and end week is 2026-02-15', () => {
        const { weekBegin, weekEnd } = dateHelper.getWeekBeginAndEndDates('2026-02-21')

        expect(weekBegin.toISOString()).toEqual(new Date('2026-02-15').toISOString())
        expect(weekEnd.toISOString()).toEqual(new Date('2026-02-21').toISOString())
    })
})
//------------------------------------------------------
//------------------------------------------------------
describe('getBeginOfMonth', () => {
    it('Month begin date for 2026-02-15 is 2026-02-01', () => {
        const date = new Date('2026-02-15')
        const result = dateHelper.getBeginOfMonth(date)

        const resultStr = dateHelper.toFormattedString(result, 'YYYY-MM-DD')
        expect(resultStr).toEqual('2026-02-01')
    })

    it('Month begin date for 2026-02-01 is 2026-02-01', () => {
        const date = new Date('2026-02-01')
        const result = dateHelper.getBeginOfMonth(date)

        const resultStr = dateHelper.toFormattedString(result, 'YYYY-MM-DD')
        expect(resultStr).toEqual('2026-02-01')
    })

    it('Month begin date for 2026-02-28 is 2026-02-01', () => {
        const date = new Date('2026-02-28')
        const result = dateHelper.getBeginOfMonth(date)

        const resultStr = dateHelper.toFormattedString(result, 'YYYY-MM-DD')
        expect(resultStr).toEqual('2026-02-01')
    })
})
//------------------------------------------------------
//------------------------------------------------------
describe('getEndOfMonth', () => {
    it('Month end date for 2026-02-15 is 2026-02-28', () => {
        const date = new Date('2026-02-15')
        const result = dateHelper.getEndOfMonth(date)

        const resultStr = dateHelper.toFormattedString(result, 'YYYY-MM-DD')
        expect(resultStr).toEqual('2026-02-28')
    })

    it('Month end date for 2026-02-15 is 2026-02-28', () => {
        const date = new Date('2026-02-01')
        const result = dateHelper.getEndOfMonth(date)

        const resultStr = dateHelper.toFormattedString(result, 'YYYY-MM-DD')
        expect(resultStr).toEqual('2026-02-28')
    })

    it('Month end date for 2026-02-15 is 2026-02-28', () => {
        const date = new Date('2026-02-28')
        const result = dateHelper.getEndOfMonth(date)

        const resultStr = dateHelper.toFormattedString(result, 'YYYY-MM-DD')
        expect(resultStr).toEqual('2026-02-28')
    })
})
//------------------------------------------------------
//------------------------------------------------------
describe('getRangeOrTemplateString', () => {
    it('Range for 2026-02-15 - 2026-02-28 is 15/02/2026 - 28/02/2026', () => {
        const result = dateHelper.getRangeOrTemplateString('2026-02-15', '2026-02-28', 'DD/MM/YYYY')
        expect(result).toEqual('15/02/2026 - 28/02/2026')
    })
})

describe('getRangeOrTemplateString', () => {
    it('Range for null - null is __/__/____ - __/__/____', () => {
        const result = dateHelper.getRangeOrTemplateString(null, null, 'DD/MM/YYYY')

        expect(result).toEqual('__/__/____ - __/__/____')
    })
})
//------------------------------------------------------
//------------------------------------------------------