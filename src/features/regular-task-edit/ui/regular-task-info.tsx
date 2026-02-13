import { RegularTaskModel } from '@/src/entities/regular-tasks'
import { dateHelper, weekDayNames } from "@shared/lib/helpers"
import { AppText, BorderedView } from '@shared/ui'


type Props = {
    item: RegularTaskModel
}

export function RegularTaskInfo({ item }: Props) {
    const { period, periodSize, beginDate, endDate,
        su, mo, tu, we, th, fr, sa } = item

    const fromStr = !!beginDate ? dateHelper.dbStrDateToFormattedString(beginDate, 'DD/MM/YYYY') : ''
    const fromDayStr = !!beginDate ? fromStr.substring(0, 2) : ''
    const fromDayAndMonthStr = !!beginDate ? fromStr.substring(0, 5) : ''
    const toStr = !!endDate ? dateHelper.dbStrDateToFormattedString(endDate.toString(), 'DD/MM/YYYY') : ''

    const days = []
    su && days.push(weekDayNames[0])
    mo && days.push(weekDayNames[1])
    tu && days.push(weekDayNames[2])
    we && days.push(weekDayNames[3])
    th && days.push(weekDayNames[4])
    fr && days.push(weekDayNames[5])
    sa && days.push(weekDayNames[6])

    const daysStr = days.length === 0 ? '...' : days.join(', ')

    return (
        <BorderedView borderColorType='success'>
            <AppText
                textColor='success'
                iconType='info'
            >
                {!!period && period === 'everyDay'
                    && !!periodSize
                    && !!fromStr
                    && (
                        <>
                            {`Repeat DAILY every ${periodSize} day. Starting from ${fromStr}`
                                + (!!toStr ? ` and ending on ${toStr}` : '')}
                        </>
                    )
                }
                {!!period && period === 'everyWeek'
                    && !!periodSize
                    && !!fromStr
                    && (
                        <>
                            {`Repeat WEEKLY every ${periodSize} week on ${daysStr}. Starting from ${fromStr}`
                                + (!!toStr ? ` and ending on ${toStr}` : '')}
                        </>
                    )
                }
                {!!period && period === 'everyMonth'
                    && !!periodSize
                    && !!fromStr
                    && (
                        <>
                            {`Repeat MONTHLY every ${periodSize} month on ${fromDayStr} date. Starting from ${fromStr}`
                                + (!!toStr ? ` and ending on ${toStr}.` : '.')
                            }
                        </>
                    )
                }
                {!!period && period === 'everyYear'
                    && !!periodSize
                    && !!fromStr
                    && (
                        <>
                            {`Repeat YEARLY every ${periodSize} year on ${fromDayAndMonthStr}. Starting from ${fromStr}`
                                + (!!toStr ? ` and ending on ${toStr}.` : '.')
                            }
                        </>
                    )
                }
            </AppText>
        </BorderedView>
    )
}