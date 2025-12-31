import { useAppData } from '@/src/app/providers'
import { dateHelper, stringHelper } from '@/src/shared/lib/helpers'
import { useAppDispatch, useAppSelector } from '@/src/shared/lib/hooks'
import { ModificationType, Paging } from '@/src/shared/lib/types'
import { createTask, DEFAULT_TASK, fetchTasks, getCopyOfPaging, removeTask, selectTasks, Task, TaskStatus, updateTask } from '@entities/tasks'
import { TaskEditFormModal } from '@features/task-edit'
import { useAppTheme } from '@shared/theme/hooks'
import { RemoveFormModal } from '@shared/ui/remove-form-modal'
import { useCallback, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Badge, Button, Chip, Divider, IconButton, Text } from 'react-native-paper'
import { FindOptionsWhere } from 'typeorm'
import { ListFilterForm } from './list-filter-form'
import { TaskListItem } from './list-item'


interface PageState {
    mode: ModificationType
    item: Task
}

const isSameDate = (currentItem: Task, prevItem: Task) => {
    return !!currentItem
        && !!prevItem
        && ((stringHelper.isEmpty(currentItem.date) && stringHelper.isEmpty(prevItem.date))
            || (!stringHelper.isEmpty(currentItem.date) && !stringHelper.isEmpty(prevItem.date) && currentItem.date === prevItem.date))
}

export const TaskList = () => {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors

    const dispatch = useAppDispatch()
    const appData = useAppData()

    const [state, setState] = useState<PageState>({
        mode: 'none',
        item: { ...DEFAULT_TASK } as Task,
    })

    const [isLoading, setIsLoading] = useState(false)

    const paging = useAppSelector(getCopyOfPaging)
    const items = useAppSelector(selectTasks)

    const changeMode = useCallback((mode: ModificationType = 'none', itemId: number = 0) => {
        const item = itemId === 0 ? { ...DEFAULT_TASK } as Task : items.find(item => item.id === itemId)!

        setState({
            ...state,
            mode: mode,
            item
        })
    }, [items, state])

    const changeItemStatus = useCallback((itemId: number, status: TaskStatus) => {
        const item = { ...(items.find(item => item.id === itemId)!) }
        item.status = status
        dispatch(updateTask({ taskRep: appData.taskRep, item }))
    }, [appData.taskRep, dispatch, items])

    const fetchMore = useCallback((paging: Paging<Task>) => {
        console.log("fetchMore...")
        paging = { ...paging }

        if (isLoading || !paging.hasNext) {
            console.log(`fetchMore stopped (isLoading:${isLoading}, paging.hasNext:${paging.hasNext})`)
            return
        }

        console.log("fetchMore begin")
        setIsLoading(true)

        const timeout = window.setTimeout(async () => {
            dispatch(await fetchTasks({ taskRep: appData.taskRep, paging: paging }))
                .then(() => {
                    setIsLoading(false)
                    window.clearTimeout(timeout)
                    console.log("fetchMore end")
                })
        }, 1000)
    },
        [appData.taskRep, isLoading, setIsLoading, dispatch])



    const onChangeFilter = useCallback((filter: FindOptionsWhere<Task> | undefined) => {
        console.log("onChangeFilter...")
        paging.fetchType = 'fetchFromBegin'
        paging.where = filter
        paging.hasNext = true
        console.log('paging', paging)

        fetchMore(paging)
        changeMode()
    },
        [fetchMore, paging])

    return (
        <>
            <View style={styles.row}>
                <Button
                    onPress={() => changeMode('edit')}
                    icon={{ source: 'plus-thick', direction: 'ltr' }}
                    mode='contained'
                >
                    Add task
                </Button>
                <IconButton
                    style={{ margin: 0, marginLeft: 10 }}
                    onPress={() => changeMode('filter')}
                    icon="filter"
                    mode='contained'
                    size={20}
                >
                </IconButton>
                <Badge
                    style={{ alignSelf: 'flex-start', marginLeft: -10 }}
                >
                    {Object.keys(paging.where ?? {}).length}
                </Badge>
            </View >
            <View style={styles.row2}>
                <Text variant='labelMedium'>Item count:{paging.itemCount} skip:{paging.skip} </Text>
            </View>
            <FlatList
                data={items}
                extraData={[items, paging]}
                style={{ borderColor: primary, borderWidth: 1 }}
                keyExtractor={((item: Task, index: number) => `task-${item.id}`)}
                ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                initialNumToRender={8}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                    console.log("onEndReached...")
                    paging.fetchType = 'fetchNext'
                    fetchMore(paging)
                }}

                renderItem={(itemInfo: ListRenderItemInfo<Task>) => {
                    return (
                        <>
                            {!isSameDate(items[itemInfo.index], items[itemInfo.index - 1]) &&
                                <Chip
                                    mode='flat'
                                    icon='calendar'
                                    compact={true}
                                >
                                    {stringHelper.isEmpty(itemInfo.item.date) ? '...' : dateHelper.dbStrDateToFormattedString(itemInfo.item.date, 'DD/MM/YYYY')}
                                </Chip>
                            }
                            <TaskListItem
                                item={itemInfo.item}
                                onChange={changeMode}
                                onChangeStatus={changeItemStatus}
                            />
                        </>
                    )
                }}
                ListEmptyComponent={<Text variant='labelMedium'>No data</Text>}
                ListFooterComponent={() =>
                    <>
                        {isLoading &&
                            <ActivityIndicator style={{ marginVertical: 10 }} animating={true} color={primary} />
                        }
                        <Divider style={styles.divider} />
                    </>
                }
            />
            {state.mode === 'edit' &&
                <TaskEditFormModal
                    item={state.item}
                    onChangeItem={(item: Task) => {
                        if (!!item.id) {
                            dispatch(updateTask({ taskRep: appData.taskRep, item }))
                                .then(() => {
                                    changeMode()
                                })
                        } else {
                            dispatch(createTask({ taskRep: appData.taskRep, item }))
                                .then(() => {
                                    paging.fetchType = 'fetchFromBegin'
                                    fetchMore(paging)
                                    changeMode()
                                })
                        }
                    }}
                    onClose={changeMode}
                />
            }
            {state.mode === 'remove' &&
                <RemoveFormModal
                    itemId={state.item.id}
                    questionText={`Do you really want to delete task '${state.item.title}' 
                    by id '${state.item.id}'?`}
                    onDelete={(id: number) => {
                        dispatch(removeTask({ taskRep: appData.taskRep, id }))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
            {state.mode === 'filter' &&
                <ListFilterForm
                    filter={paging.where}
                    onChangeFilter={onChangeFilter}
                    onClose={changeMode}
                />
            }
        </>
    )
}

const styles = StyleSheet.create({
    divider: {
        marginHorizontal: 5,
        marginVertical: 1,
    },
    row: {
        flexDirection: 'row',
    },
    col1: {
        flexDirection: 'column',
        width: 180,
        height: 38,
    },
    col2: {
        flex: 6,
        flexDirection: 'column',
    },
    row2: {
        flexDirection: 'row',
    },
})