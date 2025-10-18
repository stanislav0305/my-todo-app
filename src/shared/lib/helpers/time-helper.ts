export const timeHelper = {
    getHoursFromStringOrUndefined: (time: string | undefined) => {
        const minutes = time?.split(':')[0]
        return minutes ? Number(minutes) : undefined
    },
    getMinutesFromStringOrUndefined: (time: string | undefined) => {
        const hours = time?.split(':')[1]
        return hours ? Number(hours) : undefined
    },
    toFormattedStringOrEmpty: (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
        if (timeHelper.isUndefined(hoursAndMinutes.hours, hoursAndMinutes.minutes)) {
            return ''
        }

        return timeHelper.padTo2Digits(hoursAndMinutes.hours!) + ':' + timeHelper.padTo2Digits(hoursAndMinutes.minutes!)
    },
    padTo2Digits: (num: number) => {
        return num.toString().padStart(2, '0')
    },
    isUndefined: (hours: number | undefined, minutes: number | undefined) => {
        return (typeof hours === 'undefined' || typeof minutes === 'undefined')
    }
}