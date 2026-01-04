import { useAppData } from '@/src/app/providers'
import { useAppDispatch, useAppSelector } from '@/src/shared/lib/hooks'
import { ModificationType, Paging } from '@/src/shared/lib/types'
import { createRegTask, DEFAULT_REGULAR_TASK, fetchRegTasks, getCopyOfPaging, RegularTask, removeRegTask, selectRegularTasks, updateRegTask } from '@entities/regular-tasks'
import { RegularTaskEditFormModal } from '@features/regular-task-edit'
import { useAppTheme } from '@shared/theme/hooks'
import { RemoveFormModal } from '@shared/ui/remove-form-modal'
import { useCallback, useState } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Badge, Button, Divider, IconButton, Text } from 'react-native-paper'
import { FindOptionsWhere } from 'typeorm'
import { ListFilterForm } from './list-filter-form'
import { RegularTaskListItem } from './list-item'


interface PageState {
    mode: ModificationType
    item: RegularTask
}

export const RegularTaskList = () => {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors

    const dispatch = useAppDispatch()
    const appData = useAppData()

    const [state, setState] = useState<PageState>({
        mode: 'none',
        item: { ...DEFAULT_REGULAR_TASK } as RegularTask,
    })

    const [isLoading, setIsLoading] = useState(false)

    const paging = useAppSelector(getCopyOfPaging)
    const items = useAppSelector(selectRegularTasks)

    const changeMode = useCallback((mode: ModificationType = 'none', itemId: number = 0) => {
        const item = itemId === 0 ? { ...DEFAULT_REGULAR_TASK } as RegularTask : items.find(item => item.id === itemId)!

        setState({
            ...state,
            mode: mode,
            item
        })
    }, [items, state])

    const fetchMore = useCallback((paging: Paging<RegularTask>) => {
        console.log("fetchMore...")
        paging = { ...paging }

        if (isLoading || !paging.hasNext) {
            console.log(`fetchMore stopped (isLoading:${isLoading}, paging.hasNext:${paging.hasNext})`)
            return
        }

        console.log("fetchMore begin")
        setIsLoading(true)

        const timeout = window.setTimeout(async () => {
            dispatch(await fetchRegTasks({ regularTaskRep: appData.regularTaskRep, paging: paging }))
                .then(() => {
                    setIsLoading(false)
                    window.clearTimeout(timeout)
                    console.log("fetchMore end")
                })
        }, 1000)
    },
        [appData.regularTaskRep, isLoading, setIsLoading, dispatch])



    const onChangeFilter = useCallback((filter: FindOptionsWhere<RegularTask> | undefined) => {
        console.log("onChangeFilter...")
        paging.fetchType = 'fetchFromBegin'
        paging.where = filter
        paging.hasNext = true
        console.log('paging', paging)

        fetchMore(paging)
        changeMode()
    },
        [fetchMore, changeMode, paging])

    return (
        <>
            <View style={styles.row}>
                <Button
                    onPress={() => changeMode('edit')}
                    icon={{ source: 'plus-thick', direction: 'ltr' }}
                    mode='contained'
                >
                    Add regular task
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
                <Text variant='labelMedium'>Item count: {paging.itemCount}</Text>
            </View>
            <FlatList
                data={items}
                extraData={[items, paging]}
                style={{ borderColor: primary, borderWidth: 1 }}
                keyExtractor={((item: RegularTask, index: number) => `reg-task-${item.id}`)}
                ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                initialNumToRender={8}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                    console.log("onEndReached...")
                    paging.fetchType = 'fetchNext'
                    fetchMore(paging)
                }}

                renderItem={(itemInfo: ListRenderItemInfo<RegularTask>) => {
                    return (
                        <RegularTaskListItem
                            item={itemInfo.item}
                            onChange={changeMode}
                        />
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
                <RegularTaskEditFormModal
                    item={state.item}
                    onChangeItem={(item: RegularTask) => {
                        if (!!item.id) {
                            dispatch(updateRegTask({ regularTaskRep: appData.regularTaskRep, item }))
                                .then(() => {
                                    changeMode()
                                })
                        } else {
                            dispatch(createRegTask({ regularTaskRep: appData.regularTaskRep, item }))
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
                    questionText={`Do you really want to delete regular task '${state.item.title}' 
                    by id '${state.item.id}'?`}
                    onDelete={(id: number) => {
                        dispatch(removeRegTask({ regularTaskRep: appData.regularTaskRep, id }))
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