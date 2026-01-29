import { createRegTask, DEFAULT_REGULAR_TASK, fetchRegTasks, filterModes, RegularTask, RegularTaskColumnsShow, RegularTaskExtendedRepository, RegularTaskPaging, RegularTasksFilterModeType, removeRegTask, setRegPaging, updateRegTask } from '@entities/regular-tasks'
import { AppDispatchType } from '@shared/lib/hooks'
import { DbFilter, FetchTasksTypes, ModificationType } from '@shared/lib/types'
import { AppTheme } from '@shared/theme/lib'
import { selectAppTheme } from '@shared/theme/model'
import { ListFooter, ListNoData } from '@shared/ui'
import { RemoveFormModal } from '@shared/ui/remove-form-modal'
import React, { Component } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { Badge, Button, Divider, Icon, IconButton, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { RegularTaskEditFormModal } from '../../regular-task-edit'
import { ListColumnsShowForm } from './list-columns-show-form'
import { ListFilterForm } from './list-filter-form'
import { RegularTaskListItem } from './list-item'

type StateType = {
    mode: ModificationType
    item: RegularTask
    isLoading: boolean
    isRefreshing: boolean
}

type PropsType = {
    appTheme: AppTheme
    regularTaskRep: RegularTaskExtendedRepository
    dispatch: AppDispatchType
    paging: RegularTaskPaging
    items: RegularTask[]
}

class RegularTaskListComponent extends Component<PropsType, StateType> {
    callOnScrollEnd = true;
    keyExtractor = (item: RegularTask, index: number) =>
        `${item.deletedAt == null ? '' : 'deleted-'}regular-task-${item.id}`;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            mode: 'none',
            item: { ...DEFAULT_REGULAR_TASK } as RegularTask,
            isLoading: false,
            isRefreshing: false,
        }
    }

    componentDidMount() {
        this.fetchMore('fetchFromBegin')
    }

    changeMode = (mode: ModificationType = 'none', itemId: number = 0) => {
        const { items } = { ...this.props }

        const item =
            itemId === 0
                ? ({ ...DEFAULT_REGULAR_TASK } as RegularTask)
                : items.find(i => i.id === itemId)!

        this.setState({
            ...this.state,
            mode: mode,
            item: { ...item },
        })
    };

    fetchMore = (
        fetchType: FetchTasksTypes,
        columnsShow: RegularTaskColumnsShow | null = null,
        filter: DbFilter<RegularTask, RegularTasksFilterModeType> | null = null,
    ) => {
        console.log(`fetchMore... fetchType:${fetchType}`)

        const { regularTaskRep, dispatch, paging } = { ...this.props }
        const { isLoading } = { ...this.state }
        const newHasNext = fetchType === 'fetchFromBegin' ? true : paging.hasNext

        if (isLoading || !newHasNext) {
            console.log(
                `fetchMore stopped (isLoading:${isLoading}, hasNext:${newHasNext})`,
            )
            return
        }

        this.setState({
            ...this.state,
            isLoading: true,
        })

        const timeout = window.setTimeout(async () => {
            dispatch(
                await fetchRegTasks({
                    regularTaskRep: regularTaskRep,
                    paging,
                    fetchType,
                    columnsShow,
                    filter,
                }),
            ).then(() => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                })

                window.clearTimeout(timeout)
            })
        }, 1000)
    };

    onChangeColumnsShow = (columnsShow: RegularTaskColumnsShow) => {
        console.log('onChangeColumnsShow...')
        const { dispatch, paging } = { ...this.props }

        let newPaging = Object.assign({}, paging)
        newPaging.columnsShow = columnsShow

        dispatch(setRegPaging({ paging: newPaging }))
        this.changeMode()
    };

    onChangeFilter = (filter: DbFilter<RegularTask, RegularTasksFilterModeType>) => {
        this.fetchMore('fetchFromBegin', null, filter)
        this.changeMode()
    };

    onEndReached = () => {
        console.log('onEndReached...')
        this.fetchMore('fetchNext')
    };

    onSaveTask = async (item: RegularTask, withListReload: boolean) => {
        const { regularTaskRep, dispatch } = { ...this.props }

        const promise = !!item.id
            ? dispatch(updateRegTask({ regularTaskRep, item }))
            : dispatch(createRegTask({ regularTaskRep, item }))

        promise.then(async () => {
            if (withListReload) await this.fetchMore('fetchFromBegin')
            this.changeMode()
        })
    };

    onDeleteTask = (id: number) => {
        const { regularTaskRep, dispatch } = { ...this.props }
        const { mode } = { ...this.state }

        dispatch(
            removeRegTask({
                regularTaskRep,
                id,
                softRemove: mode === 'softRemove',
            }),
        )
        this.changeMode()
    };

    // Refreshing--------------------------------------

    onRefresh = async () => {
        this.setState({
            ...this.state,
            isRefreshing: true,
        })

        this.fetchMore('fetchFromBegin')

        this.setState({
            ...this.state,
            isRefreshing: false,
        })
    };

    //--------------------------------------------------

    renderItem = (itemInfo: ListRenderItemInfo<RegularTask>) => {
        const { paging } = { ...this.props }

        return (
            <RegularTaskListItem
                serialNumber={itemInfo.index}
                item={itemInfo.item}
                columnsShow={paging.columnsShow}
                onChange={this.changeMode}
            />
        )
    };

    render() {
        const { mode, item, isLoading, isRefreshing } = { ...this.state }
        const { paging, items, appTheme, dispatch, regularTaskRep } = { ...this.props }
        const { primary } = { ...appTheme.colors }

        return (
            <>
                <View style={styles.row}>
                    <Button
                        onPress={() => this.changeMode('edit')}
                        icon={{ source: 'plus-thick', direction: 'ltr' }}
                        mode="contained"
                    >
                        Add regular task
                    </Button>
                    <IconButton
                        style={{ margin: 0, marginLeft: 10 }}
                        onPress={() => this.changeMode('filter')}
                        icon="filter"
                        mode="contained"
                        size={20}
                    ></IconButton>
                    <Badge style={{ alignSelf: 'flex-start', marginLeft: -10 }}>
                        {paging.filter.count}
                    </Badge>
                    <IconButton
                        style={{ margin: 0, marginLeft: 10 }}
                        onPress={() => this.changeMode('columnsShow')}
                        icon="view-column"
                        mode="contained"
                        size={20}
                    ></IconButton>
                </View>
                <View style={styles.row2}>
                    <View style={styles.row2Col1}>
                        <Text variant="labelLarge" style={{ flexWrap: 'wrap' }}>
                            <Icon source={filterModes[paging.filter.mode].icon} size={20} />
                        </Text>
                        <Text variant="labelLarge" style={{ flexWrap: 'wrap' }}>
                            {` ${filterModes[paging.filter.mode].label} `}
                        </Text>
                    </View>
                    <View style={styles.row2Col2}>
                        <Text variant="labelMedium" style={styles.row2Col2Text}>
                            Item count: {paging.itemCount}
                        </Text>
                    </View>
                </View>
                <FlatList
                    data={items}
                    extraData={[items, paging]}
                    style={{ borderColor: primary, borderWidth: 1 }}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                    onEndReachedThreshold={0.25} //when scroll to 25% from the bottom
                    onMomentumScrollEnd={() => {
                        this.callOnScrollEnd && this.onEndReached()
                        this.callOnScrollEnd = false
                    }}
                    onEndReached={() => (this.callOnScrollEnd = true)}
                    renderItem={this.renderItem}
                    refreshing={isRefreshing}
                    onRefresh={this.onRefresh}
                    ListEmptyComponent={ListNoData}
                    ListFooterComponent={ListFooter({ isLoading, color: primary })}
                />
                {mode === 'edit' &&
                    <RegularTaskEditFormModal
                        item={item}
                        onChangeItem={this.onSaveTask}
                        onClose={this.changeMode}
                    />
                }
                {(mode === 'softRemove' || mode === 'remove') &&
                    <RemoveFormModal
                        itemId={item.id}
                        softRemove={mode === 'softRemove'}
                        questionText={
                            (mode === 'softRemove')
                                ? `Do you really want to move to trash regular task '${item.title}' by id '${item.id}'?`
                                : `Do you really want to delete regular task '${item.title}' by id '${item.id}'?`
                        }
                        onDelete={(id: number) => {
                            dispatch(removeRegTask({ regularTaskRep: regularTaskRep, id, softRemove: mode === 'softRemove' }))
                            this.changeMode()
                        }}
                        onClose={this.changeMode}
                    />
                }
                {mode === 'filter' &&
                    <ListFilterForm
                        filter={paging.filter}
                        onChangeFilter={this.onChangeFilter}
                        onClose={this.changeMode}
                    />
                }
                {mode === 'columnsShow' && (
                    <ListColumnsShowForm
                        columnsShow={paging.columnsShow}
                        onChangeColumnsShow={this.onChangeColumnsShow}
                        onClose={this.changeMode}
                    />
                )}
            </>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        appTheme: selectAppTheme(state),
        paging: state.regularTasks.paging,
        items: state.regularTasks.items,
    } as PropsType
}

const mapDispatchToProps = (dispatch: AppDispatchType) => {
    return {
        dispatch: dispatch,
    } as PropsType
}

type ownPropsType = {
    regularTaskRep: RegularTaskExtendedRepository
}

function mergeProps(
    stateProps: PropsType,
    dispatchProps: PropsType,
    ownProps: ownPropsType,
) {
    return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export const RegularTaskList = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(RegularTaskListComponent)

//---------------------------------------------------------------------------------------------------

const styles = StyleSheet.create({
    divider: {
        marginHorizontal: 5,
        marginVertical: 1,
        height: StyleSheet.hairlineWidth,
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
    row2Col1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
    row2Col2: {
        flex: 1,
    },
    row2Col2Text: {
        textAlign: 'right',
        marginRight: 10,
    },
})