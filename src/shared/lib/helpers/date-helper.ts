import { numberHelper } from './number-helper'
import { stringHelper } from './string-helper'

export const weekDayNames: Record<number, string> = {
    0: 'Su', //'Sunday',
    1: 'Mo', //'Monday',
    2: 'Tu', //'Tuesday',
    3: 'We', //'Wednesday',
    4: 'Th', //'Thursday',
    5: 'Fr', //'Friday',
    6: 'Sa', //'Saturday',
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
    getWeekDayName: (dateStr: string | null | undefined) => {
        if (stringHelper.isEmpty(dateStr)) return ''
        const date = dateHelper.dbStrDateToDate(dateStr as string)

        return weekDayNames[date.getDay()]
    },
}