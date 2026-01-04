import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar"
import { DateFormatType, dateHelper } from './date-helper'
import { stringHelper } from "./string-helper"


export const calendarDateHelper = {
    /*
    toUTCStringOrEmpty: (date: CalendarDate): string => {
        return typeof date === 'undefined' ? '' : dateHelper.toUTCString(new Date(date?.getDate()))
    },
*/
    toCalendarDate: (date: string | Date | null | undefined): CalendarDate => {
        //if not date and isEmpty(date)
        if (!(typeof date === 'object' && date instanceof Date) && stringHelper.isEmpty(date)) {
            return undefined as CalendarDate
        }

        if (typeof date === "string") {
            return dateHelper.dbStrDateToDate(date) as CalendarDate
        }

        if (typeof date === 'object' && date instanceof Date) {
            return date as CalendarDate
        }
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
}