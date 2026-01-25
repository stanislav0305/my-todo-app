import { dateHelper } from "@/src/shared/lib/helpers"
import { Period } from "@entities/regular-tasks"
import { View } from 'react-native'
import { Text } from 'react-native-paper'


type Props = {
    period: Period | undefined
    periodSize: number | undefined
    beginDate: string | undefined
    useLastDayFix: boolean | undefined
    su: boolean | undefined
    mo: boolean | undefined
    tu: boolean | undefined
    we: boolean | undefined
    th: boolean | undefined
    fr: boolean | undefined
    sa: boolean | undefined
}

export function ListItemInfo({ period, periodSize, beginDate, useLastDayFix,
    su, mo, tu, we, th, fr, sa
}: Props) {
    const fromStr = !!beginDate ? dateHelper.dbStrDateToFormattedString(beginDate, 'DD/MM/YYYY') : ''
    const fromDayStr = !!beginDate ? fromStr.substring(0, 2) : ''
    const fromDayAndMonthStr = !!beginDate ? fromStr.substring(0, 5) : ''

    const days = []
    su && days.push('Su')
    mo && days.push('Mo')
    tu && days.push('Tu')
    we && days.push('We')
    th && days.push('Th')
    fr && days.push('Fr')
    sa && days.push('Sa')

    const daysStr = days.length === 0 ? '...' : days.join(', ')

    return (
        <View>
            {!!period && period === 'everyDay'
                && !!periodSize
                && !!fromStr
                && (
                    <Text variant='bodySmall'>{`DAILY, every ${periodSize} day`}</Text>
                )
            }
            {!!period && period === 'everyWeek'
                && !!periodSize
                && !!fromStr
                && (
                    <Text variant='bodySmall'>{`WEEKLY, every ${periodSize} week, on: ${daysStr}`}</Text>
                )
            }
            {!!period && period === 'everyMonth'
                && !!periodSize
                && !!fromStr
                && (
                    <>
                        <Text variant='bodySmall'>{`MONTHLY, every ${periodSize} month, on: ${fromDayStr}`}</Text>
                        {!!useLastDayFix && <Text variant='bodySmall'>With day fix.</Text>}
                    </>
                )
            }
            {!!period && period === 'everyYear'
                && !!periodSize
                && !!fromStr
                && (
                    <>
                        <Text variant='bodySmall'>{`YEARLY, every ${periodSize} year, on: ${fromDayAndMonthStr}`}</Text>
                        {!!useLastDayFix && <Text variant='bodySmall'>With day fix.</Text>}
                    </>
                )
            }
        </View>
    )
}