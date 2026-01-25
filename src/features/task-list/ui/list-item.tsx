import { Task, TaskColumnsShow, TaskStatus, taskStatusIconNames } from '@entities/tasks'
import { dateHelper, stringHelper } from '@shared/lib/helpers'
import { ModificationType } from '@shared/lib/types'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme/hooks'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Chip, Divider, Icon, IconButton, Menu, Text } from 'react-native-paper'

type Props = {
    serialNumber: number
    serialNumberInDay: number
    item: Task
    showDayRow: boolean
    columnsShow: TaskColumnsShow
    onChange: (mode: ModificationType, itemId: number) => void
    onChangeStatus: (itemId: number, status: TaskStatus) => void
}

const TaskListItemComponent = ({
    serialNumber,
    serialNumberInDay,
    item,
    showDayRow,
    columnsShow,
    onChange,
    onChangeStatus,
}: Props) => {
    const appTheme = useAppTheme()
    const { success, secondary, danger, primary, blue } = appTheme.colors

    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

    return (
        <>
            {!!showDayRow && (
                <Chip mode="flat" icon="calendar" compact={true}>
                    {!stringHelper.isEmpty(item.date) && (
                        <Text variant="bodySmall">{`${dateHelper.getWeekDayName(item.date)} `}</Text>
                    )}
                    <Text variant="bodyMedium">
                        {stringHelper.isEmpty(item.date)
                            ? '...'
                            : dateHelper.dbStrDateToFormattedString(item.date, 'DD/MM/YYYY')}
                    </Text>
                </Chip>
            )}
            <View style={styles.container}>
                <View style={styles.taskItem}>
                    <View style={styles.column1}>
                        {(item.isImportant || item.isUrgent) && (
                            <View style={styles.column1Row1}>
                                {item.isImportant && (
                                    <Icon
                                        source="chevron-double-up"
                                        size={20}
                                        color={item.status === 'done' ? secondary : success}
                                    />
                                )}
                                {item.isUrgent && (
                                    <Icon
                                        source="fire"
                                        size={20}
                                        color={item.status === 'done' ? secondary : danger}
                                    />
                                )}
                            </View>
                        )}
                        <View style={styles.column1Row2}>
                            <View style={styles.column1Row2Column1}>
                                <Icon source={taskStatusIconNames[item.status]} size={20} />
                                {!!item.deletedAt && <Icon source="trash-can" size={20} />}
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
                            {!!columnsShow.serialNumberInDay && (
                                <Text
                                    variant="bodyMedium"
                                    style={{ color: blue, marginRight: 10 }}
                                >
                                    {`${serialNumberInDay + 1}.`}
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
                            {!!item.time && (
                                <Text
                                    variant="bodyMedium"
                                    style={{ color: primary, marginRight: 10 }}
                                >
                                    {item.time}
                                </Text>
                            )}
                            {!!columnsShow.date && !!item.date && (
                                <Text>
                                    date:
                                    {dateHelper.dbStrDateToFormattedString(
                                        item.date,
                                        'DD/MM/YYYY',
                                    )}{' '}
                                </Text>
                            )}
                        </View>
                        <View style={styles.row}>
                            <Text
                                variant="bodySmall"
                                style={
                                    item.status === 'done'
                                        ? [styles.columnBig, sharedStyles.strikethroughText]
                                        : [styles.columnBig]
                                }
                            >
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
                                    icon="dots-vertical"
                                    mode="contained-tonal"
                                    size={16}
                                    onPress={openMenu}
                                />
                            }
                        >
                            {item.status === 'done' && (
                                <Menu.Item
                                    title="to todo"
                                    leadingIcon={taskStatusIconNames['todo']}
                                    onPress={() => {
                                        onChangeStatus(item.id, 'todo')
                                        closeMenu()
                                    }}
                                />
                            )}
                            {item.status === 'todo' && (
                                <Menu.Item
                                    title="to doing"
                                    leadingIcon={taskStatusIconNames['doing']}
                                    onPress={() => {
                                        onChangeStatus(item.id, 'doing')
                                        closeMenu()
                                    }}
                                />
                            )}
                            {item.status === 'doing' && (
                                <Menu.Item
                                    title="to done"
                                    leadingIcon={taskStatusIconNames['done']}
                                    onPress={() => {
                                        onChangeStatus(item.id, 'done')
                                        closeMenu()
                                    }}
                                />
                            )}
                            <Menu.Item
                                title="edit"
                                leadingIcon="pencil"
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
            </View>
        </>
    )
}

export const TaskListItem = React.memo(TaskListItemComponent)

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
    },
})
