export function getDateNowUTC() {
    return new Date(Date.now())
}

export function addUTCDays(dateStr: string, days: number) {
    let result = new Date(dateStr)
    result.setUTCDate(result.getUTCDate() + days)
    return result
}

export function toUTCString(date: Date) {
    return date.toUTCString()
}

export function DateStrParse(value: string): number {
    return (value && value.length > 0) ? Date.parse(value) : 0
}