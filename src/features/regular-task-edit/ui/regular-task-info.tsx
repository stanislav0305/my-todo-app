import { dateHelper } from "@/src/shared/lib/helpers"
import { useAppTheme } from "@/src/shared/theme/hooks"
import { Period } from "@entities/regular-tasks"
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet, View } from "react-native"
import { Text } from 'react-native-paper'


type Props = {
    period: Period | undefined
    periodSize: number | undefined
    from: Date | undefined
    to: Date | null | undefined
    useLastDayFix: boolean | undefined
    su: boolean | undefined
    mo: boolean | undefined
    tu: boolean | undefined
    we: boolean | undefined
    th: boolean | undefined
    fr: boolean | undefined
    sa: boolean | undefined
}

export function RegularTaskInfo({ period, periodSize, from, to, useLastDayFix,
    su, mo, tu, we, th, fr, sa
}: Props) {
    const appTheme = useAppTheme()
    const { success } = appTheme.colors

    const fromStr = !!from ? dateHelper.toFormattedString(from!, 'DD/MM/YYYY') : ''
    const fromDayStr = !!from ? fromStr.substring(0, 2) : ''
    const fromDayAndMonthStr = !!from ? fromStr.substring(0, 5) : ''
    const toStr = !!to ? dateHelper.toFormattedString(to!, 'DD/MM/YYYY') : ''

    const days = []
    su && days.push('Sunday')
    mo && days.push('Monday')
    tu && days.push('Tuesday')
    we && days.push('Washday')
    th && days.push('Thursday')
    fr && days.push('Friday')
    sa && days.push('Saturday')

    const daysStr = days.join(', ')

    return (
        <View style={[styles.container, { borderColor: success }]}>

            <Text style={{ color: success }}>
                <AntDesign
                    name="info-circle"
                    size={20}
                    color={success}
                />
                {' '}
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
                                + (!!useLastDayFix ? ` Date well be corrected to last month date if ${fromDayStr} date not exist in current month.` : '')
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
                                + (!!useLastDayFix ? ` Date well be corrected to last month date if ${fromDayAndMonthStr} date not exist in current year.` : '')
                            }
                        </>
                    )
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 5
    }
})