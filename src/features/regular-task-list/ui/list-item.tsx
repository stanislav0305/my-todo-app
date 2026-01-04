import { RegularTask } from '@entities/regular-tasks'
import { ModificationType } from '@shared/lib/types'
import { useAppTheme } from '@shared/theme/hooks'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider, Icon, IconButton, Menu, Text } from 'react-native-paper'


type Props = {
    item: RegularTask
    onChange: (mode: ModificationType, itemId: number) => void
}

export const RegularTaskListItem = ({ item, onChange }: Props) => {
    const appTheme = useAppTheme()
    const { success, danger, primary } = appTheme.colors

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
                        {!!item.time &&
                            <Text
                                variant='bodyMedium'
                                style={{ color: primary, marginRight: 10 }}
                            >
                                {item.time}
                            </Text>
                        }
                        <Text
                            variant='bodySmall'
                            style={styles.columnBig}>
                            {item.title}
                        </Text>
                    </View>
                    {/*
                    <View style={styles.row}>
                        <Text
                            variant='bodyMedium'
                            style={{ color: blue }}
                        >
                            id:{item.id}{' '}
                        </Text>
                        {!!item.date &&
                            <Text>
                                date:{dateHelper.dbStrDateToFormattedString(item.date, 'DD/MM/YYYY')}{' '}
                            </Text>
                        }
                    </View>
                    <View style={styles.row}>
                        <Text>
                            createdAt:{dateHelper.toFormattedString(item.createdAt, 'DD/MM/YYYY hh:mm:ss')}{' '}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text>
                            updateAt:{dateHelper.toFormattedString(item.updateAt, 'DD/MM/YYYY hh:mm:ss')}{' '}
                        </Text>
                    </View>
                    {!!item.deletedAt &&
                        <View style={styles.row}>
                            <Text>
                                deletedAt:{dateHelper.toFormattedString(item.deletedAt, 'DD/MM/YYYY hh:mm:ss')}{' '}
                            </Text>
                        </View>
                    }
               
                */}
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
                            title='remove'
                            leadingIcon='trash-can'
                            onPress={() => {
                                onChange('remove', item.id)
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