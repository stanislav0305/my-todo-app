export const dateHelper = {
    getDateNowUTC: () => {
        return new Date(Date.now())
    },

    addUTCDays: (dateStr: string, days: number) => {
        let result = new Date(dateStr)
        result.setUTCDate(result.getUTCDate() + days)
        return result
    },

    toUTCString: (date: Date) => {
        return date.toUTCString()
    },

    DateStrParse: (value: string): number => {
        return (value && value.length > 0) ? Date.parse(value) : 0
    }
}