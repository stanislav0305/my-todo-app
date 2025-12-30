import { numberHelper } from "./number-helper"

export type TimeFormatType = 'hh:mm' | 'hh:mm:ss' | 'hh:mm:ss.ms'
export type TimeTemplateType = '__:__' | '__:___:__' | '__:___:__.___'

const templatesByFormats = new Map<TimeFormatType, TimeTemplateType>([
    ['hh:mm', '__:__'],
    ['hh:mm:ss', '__:___:__'],
    ['hh:mm:ss.ms', '__:___:__.___']
])

export const timeHelper = {
    getHoursFromStringOrUndefined: (time: string | undefined) => {
        const minutes = time?.split(':')[0]
        return minutes ? Number(minutes) : undefined
    },
    getMinutesFromStringOrUndefined: (time: string | undefined) => {
        const hours = time?.split(':')[1]
        return hours ? Number(hours) : undefined
    },
    toFormattedStringOrEmpty: (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }, format: TimeFormatType) => {
        if (timeHelper.isUndefined(hoursAndMinutes.hours, hoursAndMinutes.minutes)) {
            return ''
        }

        const time = new Date(1, 1, 1, hoursAndMinutes.hours, hoursAndMinutes.minutes, 0, 0)
        return timeHelper.toFormattedString(time, format)
    },
    isUndefined: (hours: number | undefined, minutes: number | undefined) => {
        return (typeof hours === 'undefined' || typeof minutes === 'undefined')
    },
    toFormattedString: (date: Date, format: TimeFormatType) => {
        if (!date) {
            return ''
        }

        let result = [
            numberHelper.padTo2Digits(date.getHours()),
            numberHelper.padTo2Digits(date.getMinutes()),
        ]
            .join(':')

        if (format === 'hh:mm:ss' || format === 'hh:mm:ss.ms') {
            result += ':' + numberHelper.padTo2Digits(date.getSeconds())
        }

        if (format === 'hh:mm:ss.ms') {
            result += '.' + numberHelper.padTo2Digits(date.getMilliseconds())
        }

        return result
    },
    getTemplate: (format: TimeFormatType) => {
        return templatesByFormats.get(format)
    },
}