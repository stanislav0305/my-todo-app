import { numberHelper } from './number-helper'
import { stringHelper } from './string-helper'

export const weekDayNamesShort: Record<number, string> = {
    0: 'Su', //'Sunday',
    1: 'Mo', //'Monday',
    2: 'Tu', //'Tuesday',
    3: 'We', //'Wednesday',
    4: 'Th', //'Thursday',
    5: 'Fr', //'Friday',
    6: 'Sa', //'Saturday',
}

export const weekDayNames: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
}

//for sqlite db is used date format YYYY-MM-DD
export type DateFormatType =
    | 'YYYY-MM-DD'
    | 'DD/MM/YYYY'
    | 'DD/MM/YYYY hh:mm:ss'
export type DateTemplateType =
    | '____-__-__'
    | '__/__/____'
    | '__/__/____ __:__:__'

const templatesByFormats = new Map<DateFormatType, DateTemplateType>([
    ['YYYY-MM-DD', '____-__-__'],
    ['DD/MM/YYYY', '__/__/____'],
    ['DD/MM/YYYY hh:mm:ss', '__/__/____ __:__:__'],
])

export const dateHelper = {
    ///for formats YYYY-MM-DD or YYYY-MM-DDT00:00 or YYYY-MM-DDT00:00:00 or YYYY-MM-DDT00:00:00.000Z
    isUndefinedOrNull: (date: Date | null | undefined): boolean => {
        return typeof date === 'undefined' || date === null
    },
    dbStrDateToDate: (dateStr: string) => new Date(dateStr),
    dbStrDateToFormattedString(
        dateStr: string | null | undefined,
        format: DateFormatType,
    ) {
        if (stringHelper.isEmpty(dateStr)) return ''

        const date = dateHelper.dbStrDateToDate(dateStr as string)
        return dateHelper.toFormattedString(date, format)
    },
    dbStrDateToMonthDayNumberOrZero: (dateStr: string | null | undefined): number => {
        if (stringHelper.isEmpty(dateStr)) return 0

        const date = dateHelper.dbStrDateToDate(dateStr as string)
        return date.getDate()
    },
    dbStrDateToMonthNumberOrZero: (dateStr: string | null | undefined): number => {
        if (stringHelper.isEmpty(dateStr)) return 0

        const date = dateHelper.dbStrDateToDate(dateStr as string)
        return date.getMonth() + 1
    },
    DateStrParse: (value: string): number => {
        return value && value.length > 0 ? Date.parse(value) : 0
    },
    toFormattedString: (
        date: Date | null | undefined,
        format: DateFormatType,
    ) => {
        let result = ''

        if (dateHelper.isUndefinedOrNull(date)) {
            return result
        }

        date = date as Date
        switch (format) {
            case 'DD/MM/YYYY': {
                result = [
                    numberHelper.padTo2Digits(date.getDate()),
                    numberHelper.padTo2Digits(date.getMonth() + 1),
                    numberHelper.padTo2Digits(date.getFullYear()),
                ].join('/')

                break
            }
            case 'DD/MM/YYYY hh:mm:ss': {
                result = [
                    numberHelper.padTo2Digits(date.getDate()),
                    numberHelper.padTo2Digits(date.getMonth() + 1),
                    numberHelper.padTo2Digits(date.getFullYear()),
                ].join('/')

                result += ' '

                result += [
                    numberHelper.padTo2Digits(date.getHours()),
                    numberHelper.padTo2Digits(date.getMinutes()),
                    numberHelper.padTo2Digits(date.getSeconds()),
                ].join(':')

                break
            }
            case 'YYYY-MM-DD': {
                result = [
                    numberHelper.padTo2Digits(date.getFullYear()),
                    numberHelper.padTo2Digits(date.getMonth() + 1),
                    numberHelper.padTo2Digits(date.getDate()),
                ].join('-')

                break
            }
            default: {
                break
            }
        }

        return result
    },
    getTemplate: (format: DateFormatType) => {
        return templatesByFormats.get(format)
    },
    getWeekDayNumOrNull: (dateStr: string | null | undefined): number | null => {
        if (stringHelper.isEmpty(dateStr)) return null
        const date = dateHelper.dbStrDateToDate(dateStr as string)

        return date.getDay()
    },
    getWeekDayNameShort: (dateStr: string | null | undefined) => {
        const dayNum = dateHelper.getWeekDayNumOrNull(dateStr)
        return dayNum == null ? '' : weekDayNamesShort[dayNum]
    },
    getWeekDayName: (dateStr: string | null | undefined) => {
        const dayNum = dateHelper.getWeekDayNumOrNull(dateStr)
        return dayNum == null ? '' : weekDayNames[dayNum]
    },
    //----------------------------------------------------------------
    getNearestDate: (dateStr: string, nearestWeekDay: number): string => {
        //get nearest next date
        const d = dateHelper.dbStrDateToDate(dateStr as string)
        const bdWeekDay = dateHelper.getWeekDayNumOrNull(dateStr)!
        const shift = dateHelper.getNearestDateShift(bdWeekDay, nearestWeekDay)

        d.setDate(d.getDate() + shift)
        return dateHelper.toFormattedString(d, 'YYYY-MM-DD')
    },
    getNearestDateShift: (dateWeekDay: number, nearestWeekDay: number): number => {
        return (dateWeekDay <= nearestWeekDay) ? nearestWeekDay - dateWeekDay : 7 - (dateWeekDay - nearestWeekDay)
    },
    //----------------------------------------------------------------
    getWeekBeginAndEndDates: (dateStr: string) => {
        const weekEndStr = dateHelper.getNearestDate(dateStr, 6)
        const weekEnd = dateHelper.dbStrDateToDate(weekEndStr)

        const weekBegin = new Date(weekEnd)
        weekBegin.setDate(weekBegin.getDate() - 6)

        return { weekBegin, weekEnd }
    },
    //----------------------------------------------------------------
    getBeginOfMonth: (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1)
    },
    getEndOfMonth: (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    },
    getMonthBeginAndEndDates: (dateStr: string) => {
        const date = dateHelper.dbStrDateToDate(dateStr)
        const monthBegin = dateHelper.getBeginOfMonth(date)
        const monthEnd = dateHelper.getEndOfMonth(date)

        return { monthBegin, monthEnd }
    },
    //----------------------------------------------------------------
    getRangeOrTemplateString: (startDateStr: string | null | undefined, endDateStr: string | null | undefined, format: DateFormatType) => {
        const startDateText = stringHelper.isEmpty(startDateStr)
            ? dateHelper.getTemplate('DD/MM/YYYY')
            : dateHelper.toFormattedString(dateHelper.dbStrDateToDate(startDateStr!), format)

        const endDateText = stringHelper.isEmpty(endDateStr)
            ? dateHelper.getTemplate('DD/MM/YYYY')
            : dateHelper.toFormattedString(dateHelper.dbStrDateToDate(endDateStr!), format)

        return `${startDateText} - ${endDateText}`
    },
    //----------------------------------------------------------------
    addDays: (dateStr: string, shift: number) => {
        const date = dateHelper.dbStrDateToDate(dateStr)
        date.setDate(date.getDate() + shift)

        return date
    },
    changeMonth: (dateStr: string, increaseOne: boolean) => {
        const date = dateHelper.dbStrDateToDate(dateStr)
        date.setMonth(date.getMonth() + (increaseOne ? 1 : (-1)))

        return date
    }
}