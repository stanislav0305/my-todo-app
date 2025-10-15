export const timeHelper = {
    getHoursFromString: (time: string) => {
        return Number(time?.split(':')[0] ?? '0')
    },
    getMinutesFromString: (time: string) => {
        return Number(time?.split(':')[1] ?? '0')
    },
    toFormattedString: (hoursAndMinutes: { hours: number, minutes: number }) => {
        return timeHelper.padTo2Digits(hoursAndMinutes.hours) + ':' + timeHelper.padTo2Digits(hoursAndMinutes.minutes)
    },
    padTo2Digits: (num: number) => {
        return num.toString().padStart(2, '0');
    },
}