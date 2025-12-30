import { numberHelper } from "./number-helper"


//for sqlite db is used date format YYYY-MM-DD
export type DateFormatType = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'DD/MM/YYYY hh:mm:ss'
export type DateTemplateType = '____-__-__' | '__/__/____' | '__/__/____ __:__:__'

const templatesByFormats = new Map<DateFormatType, DateTemplateType>([
    ['YYYY-MM-DD', '____-__-__'],
    ['DD/MM/YYYY', '__/__/____'],
    ['DD/MM/YYYY hh:mm:ss', '__/__/____ __:__:__'],
])

export const dateHelper = {
    /*
    getDateNowUTC: () => {
        return new Date(Date.now())
    },

    addUTCDays: (dateStr: string, days: number) => {
        let result = new Date(dateStr)
        result.setUTCDate(result.getUTCDate() + days)
        return result
    },

    toUTCString: (date: Date): string => {
        return date.toUTCString()
    },

    toDate: (uTCDateStr: string) => {
        return new Date(dateHelper.DateStrParse(uTCDateStr))
    },
    */
    ///for formats YYYY-MM-DD or YYYY-MM-DDT00:00 or YYYY-MM-DDT00:00:00 or YYYY-MM-DDT00:00:00.000Z
    dbStrDateToDate: (dateStr: string) => new Date(dateStr),
    dbStrDateToFormattedString(dateStr: string, format: DateFormatType) {
        if (!dateStr)
            return ''

        const date = dateHelper.dbStrDateToDate(dateStr)
        return dateHelper.toFormattedString(date, format)
    },
    DateStrParse: (value: string): number => {
        return (value && value.length > 0) ? Date.parse(value) : 0
    },
    toFormattedString: (date: Date | null, format: DateFormatType) => {
        let result = ''

        if (!date) {
            return result
        }

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
                ]
                    .join('/')

                result += ' '

                result += ([
                    numberHelper.padTo2Digits(date.getHours()),
                    numberHelper.padTo2Digits(date.getMinutes()),
                    numberHelper.padTo2Digits(date.getSeconds()),
                ])
                    .join(':')

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
    }
    //date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}