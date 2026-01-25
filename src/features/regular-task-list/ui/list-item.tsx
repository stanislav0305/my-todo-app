import { dateHelper } from '@/src/shared/lib/helpers'
import { RegularTask, RegularTaskColumnsShow } from '@entities/regular-tasks'
import { ModificationType } from '@shared/lib/types'
import { useAppTheme } from '@shared/theme/hooks'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider, Icon, IconButton, Menu, Text } from 'react-native-paper'
import { ListItemInfo } from './list-item-info'


type Props = {
    serialNumber: number
    item: RegularTask
    columnsShow: RegularTaskColumnsShow
    onChange: (mode: ModificationType, itemId: number) => void
}

export const RegularTaskListItem = ({ serialNumber, item, columnsShow, onChange }: Props) => {
    const appTheme = useAppTheme()
    const { success, danger, primary, blue } = appTheme.colors

    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

    return (
        <View style={styles.container}>
            <View style={styles.taskItem}>
                <View style={styles.column1}>
                    {(item.isImportant || item.isUrgent) &&
                        <View style={styles.column1Row1}>
                            {item.isImportant &&
                                <Icon
                                    source='chevron-double-up'
                                    size={20}
                                    color={success}
                                />
                            }
                            {item.isUrgent &&
                                <Icon
                                    source='fire'
                                    size={20}
                                    color={danger}
                                />
                            }
                        </View>
                    }
                    <View style={styles.column1Row2}>
                        <View style={styles.column1Row2Column1}>
                            {!!item.deletedAt &&
                                <Icon
                                    source='trash-can'
                                    size={20}
                                />
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.column2}>
                    <View style={styles.row}>
                        {!!columnsShow.serialNumber && (
                            <Text
                                variant="bodyMedium"
                                style={{ color: blue, marginRight: 10 }}
                            >
                                {`${serialNumber + 1}.`}
                            </Text>
                        )}
                        {!!columnsShow.id && (
                            <Text
                                variant="bodyMedium"
                                style={{ color: blue, marginRight: 10 }}
                            >
                                id: {item.id}
                            </Text>
                        )}
                        {!!item.time &&
                            <Text
                                variant='bodyMedium'
                                style={{ color: primary, marginRight: 10 }}
                            >
                                {item.time}
                            </Text>
                        }
                        {!!item.beginDate &&
                            <Text variant='bodyMedium'>{dateHelper.dbStrDateToFormattedString(item.beginDate, 'DD/MM/YYYY')}</Text>
                        }
                        {!!item.endDate &&
                            <Text variant='bodyMedium'>{` - ${dateHelper.dbStrDateToFormattedString(item.endDate.toString(), 'DD/MM/YYYY')}`}</Text>
                        }
                    </View>
                    <ListItemInfo
                        period={item.period}
                        periodSize={item.periodSize}
                        beginDate={item.beginDate}
                        useLastDayFix={item.useLastDayFix}
                        su={item.su}
                        mo={item.mo}
                        tu={item.tu}
                        we={item.we}
                        th={item.th}
                        fr={item.fr}
                        sa={item.sa}
                    />
                    <View style={styles.row}>
                        <Text
                            variant='bodySmall'
                            style={styles.columnBig}>
                            {item.title}
                        </Text>
                    </View>
                    {!!columnsShow.createdAt && (
                        <View style={styles.row}>
                            <Text>
                                createdAt:
                                {dateHelper.dbStrDateToFormattedString(
                                    item.createdAt,
                                    'DD/MM/YYYY hh:mm:ss',
                                )}{' '}
                            </Text>
                        </View>
                    )}
                    {!!columnsShow.updateAt && (
                        <View style={styles.row}>
                            <Text>
                                updateAt:
                                {dateHelper.dbStrDateToFormattedString(
                                    item.updateAt,
                                    'DD/MM/YYYY hh:mm:ss',
                                )}{' '}
                            </Text>
                        </View>
                    )}
                    {!!columnsShow.deletedAt && !!item.deletedAt && (
                        <View style={styles.row}>
                            <Text>
                                deletedAt:
                                {dateHelper.dbStrDateToFormattedString(
                                    item.deletedAt,
                                    'DD/MM/YYYY hh:mm:ss',
                                )}{' '}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.column3}>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton
                                icon='dots-vertical'
                                mode='contained-tonal'
                                size={16}
                                onPress={openMenu}
                            />
                        }>
                        <Menu.Item
                            title='edit'
                            leadingIcon='pencil'
                            onPress={() => {
                                onChange('edit', item.id)
                                closeMenu()
                            }}
                        />
                        <Divider style={styles.divider} />
                        <Menu.Item
                            title={!!item.deletedAt ? 'remove' : 'move to trash'}
                            leadingIcon={!!item.deletedAt ? 'close-thick' : 'trash-can'}
                            onPress={() => {
                                onChange(!!item.deletedAt ? 'remove' : 'softRemove', item.id)
                                closeMenu()
                            }}
                        />
                    </Menu>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
    },
    taskItem: {
        flex: 1,
        flexDirection: 'row',
    },
    column1: {
        flexDirection: 'column',
        width: 45,
    },
    column1Row1: {
        height: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
    },
    column1Row2: {
        height: 20,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    column1Row2Column1: {
        height: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
    },
    column2: {
        flex: 6,
        flexDirection: 'column',
    },
    column3: {
        flexDirection: 'column',
        width: 40,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
        padding: 0,
        margin: 0,
    },
    columnBig: {
        flex: 2,
        margin: 2,
    },
    columnSmall: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
    },
    divider: {
        marginHorizontal: 5,
        marginVertical: 1,
    }
})