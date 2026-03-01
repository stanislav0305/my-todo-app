import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar"
import { DateFormatType, dateHelper } from './date-helper'
import { stringHelper } from "./string-helper"


export const calendarDateHelper = {
    toCalendarDate: (date: string | null | undefined): CalendarDate => {
        if (stringHelper.isEmpty(date)) {
            return undefined as CalendarDate
        }

        date = date as string
        return dateHelper.dbStrDateToDate(date) as CalendarDate
    },


    isUndefined: (date: CalendarDate): boolean => {
        return typeof date === 'undefined'
    },
    isUndefinedOrNull: (date: CalendarDate): boolean => {
        return typeof date === 'undefined' || date === null
    },
    toFormattedStringOrEmpty: (date: CalendarDate, format: DateFormatType) => {
        if (calendarDateHelper.isUndefinedOrNull(date)) {
            return ''
        }

        return dateHelper.toFormattedString(date as Date, format)
    },
    getRangeOrTemplateString: (startDate: CalendarDate, endDate: CalendarDate, format: DateFormatType) => {
        const startDateText = typeof startDate === 'undefined'
            ? dateHelper.getTemplate('DD/MM/YYYY')
            : dateHelper.toFormattedString(startDate as Date, format)

        const endDateText = typeof endDate === 'undefined'
            ? dateHelper.getTemplate('DD/MM/YYYY')
            : dateHelper.toFormattedString(endDate as Date, format)

        return `${startDateText} - ${endDateText}`
    },
}