import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar"
import { DateFormatType, dateHelper } from './date-helper'
import { stringHelper } from "./string-helper"


export const calendarDateHelper = {
    /*
    toUTCStringOrEmpty: (date: CalendarDate): string => {
        return typeof date === 'undefined' ? '' : dateHelper.toUTCString(new Date(date?.getDate()))
    },
*/
    toCalendarDate: (dateStr: string): CalendarDate => {
        return stringHelper.isEmpty(dateStr)
            ? undefined as CalendarDate
            : dateHelper.dbStrDateToDate(dateStr) as CalendarDate
    },

    isUndefined: (date: CalendarDate): boolean => {
        return typeof date === 'undefined'
    },
    toFormattedStringOrEmpty: (date: CalendarDate, format: DateFormatType) => {
        if (calendarDateHelper.isUndefined(date)) {
            return ''
        }

        return dateHelper.toFormattedString(date as Date, format)
    },
}