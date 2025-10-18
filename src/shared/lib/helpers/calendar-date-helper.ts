import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar"
import { dateHelper } from './date-helper'
import { stringHelper } from "./string-helper"


export const calendarDateHelper = {
    toUTCStringOrEmpty: (date: CalendarDate): string => {
        return typeof date === 'undefined' ? '' : dateHelper.toUTCString(new Date(date?.getDate()))
    },

    toCalendarDate: (uTCDateStr: string): CalendarDate => {
        return stringHelper.isEmpty(uTCDateStr)
            ? undefined as CalendarDate
            : new Date(dateHelper.DateStrParse(uTCDateStr)) as CalendarDate
    },

    isUndefined: (date: CalendarDate): boolean => {
        return typeof date === 'undefined'
    },
}