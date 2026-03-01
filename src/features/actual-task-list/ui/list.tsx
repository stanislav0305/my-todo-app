import { DEFAULT_TASK, Task, TaskStatus } from '@/src/entities/tasks'
import {
    ActualTaskColumnsShow,
    ActualTaskPagingExtendedRepository, actualTaskPagingInit, ActualTaskPagingModel, ActualTaskPagingPeriodModel, actualTaskPagingUpdate, ActualTasksFilterModeType, ActualTaskView,
    ActualTaskViewExtendedRepository, fetchActualTasks,
    filterModes,
    resetPaging
} from '@entities/actual-tasks'
import { DEFAULT_REGULAR_TASK_MODEL, RegularTaskModel } from '@entities/regular-tasks'
import { stringHelper } from '@shared/lib/helpers'
import { AppDispatchType } from '@shared/lib/hooks'
import { DbFilter, FetchTasksTypes, ModificationType } from '@shared/lib/types'
import { AppTheme } from '@shared/theme/lib'
import { selectAppTheme } from '@shared/theme/model'
import { ListFooter, ListNoData } from '@shared/ui'
import React, { Component } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { Divider, Icon, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { mapper } from '../mapper'
import { ActualTaskListItem, ActualTaskType } from './list-item'
import { ListPeriodFilter } from './list-period-filter'


type StateType = {
    mode: ModificationType
    item: Task | RegularTaskModel
    isLoading: boolean
    isRefreshing: boolean
}

type PropsType = {
    appTheme: AppTheme
    actualTaskPagingRep: ActualTaskPagingExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
    dispatch: AppDispatchType
    paging: ActualTaskPagingModel
    pagingPeriod: ActualTaskPagingPeriodModel
    items: ActualTaskView[]
}

class ActualTaskListComponent extends Component<PropsType, StateType> {
    actualTaskPagingRep: ActualTaskPagingExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
    callOnScrollEnd = true;
    lastStartIndex: number = 0;
    keyExtractor = (item: ActualTaskView, index: number) =>
        `${item.deletedAt == null ? '' : 'deleted-'}task-${item.id}`;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            mode: 'none',
            item: { ...DEFAULT_TASK } as Task,
            isLoading: false,
            isRefreshing: false,
        }
    }

    async componentDidMount() {
        const { actualTaskPagingRep, dispatch } = { ...this.props }
        await dispatch(actualTaskPagingInit({ actualTaskPagingRep }))
        this.fetchMore('fetchFromBegin')
    }

    changeMode = (itemType: ActualTaskType = 'Task', mode: ModificationType = 'none', itemId: string = '') => {
        const { items } = { ...this.props }

        let item: Task | RegularTaskModel
        if (itemType === 'Task') {
            item = stringHelper.isEmpty(itemId)
                ? { ...DEFAULT_TASK } as Task
                : mapper.mapActualTaskViewToTask(items.find(i => i.id === itemId)!)
        }
        else if (itemType === 'RegularTaskModel') {
            item = stringHelper.isEmpty(itemId)
                ? ({ ...DEFAULT_REGULAR_TASK_MODEL } as RegularTaskModel)
                : mapper.mapActualTaskViewToRegularTaskModel(items.find(i => i.id === itemId)!)
        } else {
            throw new Error(`ChangeMode method not implemented case. itemType=${itemType} itemId=${itemId}`)
        }

        this.setState({
            ...this.state,
            mode: mode,
            item: { ...item },
        })
    };

    isSameDate = (currentItem: ActualTaskView, prevItem: ActualTaskView) => {
        return (
            !!currentItem &&
            !!prevItem &&
            ((stringHelper.isEmpty(currentItem.date) &&
                stringHelper.isEmpty(prevItem.date)) ||
                (!stringHelper.isEmpty(currentItem.date) &&
                    !stringHelper.isEmpty(prevItem.date) &&
                    currentItem.date === prevItem.date))
        )
    }

    fetchMore = (
        fetchType: FetchTasksTypes,
        columnsShow: ActualTaskColumnsShow | null = null,
        filter: DbFilter<ActualTaskView, ActualTasksFilterModeType> | null = null,
    ) => {
        console.log(`fetchMore... fetchType:${fetchType}`)

        const { actualTaskViewRep, dispatch, paging } = { ...this.props }
        const { isLoading } = { ...this.state }
        const newHasNext = fetchType === 'fetchFromBegin' ? true : paging.hasNext

        if (isLoading || !newHasNext) {
            console.log(
                `fetchMore stopped (isLoading:${isLoading}, hasNext:${newHasNext})`,
            )
            return
        }

        this.lastStartIndex =
            fetchType === 'fetchFromBegin' ? 0 : this.lastStartIndex

        this.setState({
            ...this.state,
            isLoading: true,
        })

        const timeout = window.setTimeout(async () => {
            dispatch(
                await fetchActualTasks({
                    actualTaskViewRep: actualTaskViewRep,
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
    }

    onChangeColumnsShow = (columnsShow: ActualTaskColumnsShow) => {
        console.log('onChangeColumnsShow...')
        const { dispatch, paging } = { ...this.props }

        let newPaging = Object.assign({}, paging)
        newPaging.columnsShow = columnsShow

        dispatch(resetPaging({ paging: newPaging }))
        this.changeMode()
    }

    onChangeFilter = (filter: DbFilter<ActualTaskView, ActualTasksFilterModeType>) => {
        this.fetchMore('fetchFromBegin', null, filter)
        this.changeMode()
    }

    onChangePagingPeriod = async (pagingPeriodModel: ActualTaskPagingPeriodModel) => {
        console.log('onChangePagingPeriod... pagingPeriodModel:', pagingPeriodModel)
        const { actualTaskPagingRep, dispatch } = { ...this.props }
        await dispatch(actualTaskPagingUpdate({ actualTaskPagingRep, pagingPeriodModel }))
        this.fetchMore('fetchFromBegin')
    }

    onEndReached = () => {
        console.log('onEndReached...')
        this.fetchMore('fetchNext')
    }

    onChangeTaskStatus = (itemId: number, status: TaskStatus) => {
        /* const { taskRep, dispatch, items } = { ...this.props }
     
         const item = { ...items.find(item => item.id === itemId)! }
         item.status = status
         dispatch(updateTask({ taskRep, item })) */
    }

    onSaveTask = async (item: Task, withListReload: boolean) => {
        /*  const { taskRep, dispatch } = { ...this.props }
     
          const promise = !!item.id
              ? dispatch(updateTask({ taskRep, item }))
              : dispatch(createTask({ taskRep, item }))
     
          promise.then(async () => {
              if (withListReload) await this.fetchMore('fetchFromBegin')
              this.changeMode()
          }) */
    }

    onDeleteTask = (id: number) => {
        /*  const { taskRep, dispatch } = { ...this.props }
          const { mode } = { ...this.state }
     
          dispatch(
              removeTask({
                  taskRep,
                  id,
                  softRemove: mode === 'softRemove',
              }),
          )
          this.changeMode() */
    }

    // Refreshing--------------------------------------

    onRefresh = async () => {
        this.setState({
            ...this.state,
            isRefreshing: true,
        })

        this.fetchMore('fetchFromBegin', null, null)

        this.setState({
            ...this.state,
            isRefreshing: false,
        })
    }

    //--------------------------------------------------

    onRestore = (id: number) => {
        /*  const { taskRep, dispatch } = { ...this.props }
     
          const promise = dispatch(restoreTask({ taskRep, id }))
          promise.then(async () => {
              this.changeMode()
          }) */
    }

    //--------------------------------------------------

    renderItem = (itemInfo: ListRenderItemInfo<ActualTaskView>) => {
        const { items, paging } = { ...this.props }
        const showDayRow = !this.isSameDate(
            items[itemInfo.index],
            items[itemInfo.index - 1],
        )
        this.lastStartIndex = showDayRow ? itemInfo.index : this.lastStartIndex

        return (
            <ActualTaskListItem
                filterMode={paging.filter.mode}
                serialNumber={itemInfo.index}
                serialNumberInDay={itemInfo.index - this.lastStartIndex}
                item={itemInfo.item}
                showDayRow={showDayRow}
                columnsShow={paging.columnsShow}
                onChange={this.changeMode}
                onChangeStatus={this.onChangeTaskStatus}
            />
        )
    }

    render() {
        const { isLoading, isRefreshing } = { ...this.state }
        const { paging, pagingPeriod, items, appTheme } = { ...this.props }
        const { primary } = { ...appTheme.colors }

        return (
            <>
                <View style={styles.row}>
                    {/* 
                    {!!(paging.filter.mode !== 'inTrash') && (
                        <Button
                            onPress={() => this.changeMode('edit')}
                            icon={{ source: 'plus-thick', direction: 'ltr' }}
                            mode="contained"
                        >
                            Add task
                        </Button>
                    )}
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
                    */}
                    <ListPeriodFilter
                        model={pagingPeriod}
                        onChange={this.onChangePagingPeriod}
                    />
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
                {/* 
                {mode === 'edit' && (
                    <TaskEditFormModal
                        item={item}
                        onChangeItem={this.onSaveTask}
                        onClose={this.changeMode}
                    />
                )}
                {(mode === 'softRemove' || mode === 'remove') && (
                    <RemoveFormModal
                        itemId={item.id}
                        softRemove={mode === 'softRemove'}
                        questionText={
                            mode === 'softRemove'
                                ? `Do you really want to move to trash task '${item.title}' by id '${item.id}'?`
                                : `Do you really want to remove task '${item.title}' by id '${item.id}'?`
                        }
                        onDelete={this.onDeleteTask}
                        onClose={this.changeMode}
                    />
                )}
                {(mode === 'restore') &&
                    <RestoreFormModal
                        itemId={item.id}
                        questionText={`Do you really want to restore task '${item.title}' by id '${item.id}'?`}
                        onRestore={this.onRestore}
                        onClose={this.changeMode}
                    />
                }
                {mode === 'filter' && (
                    <ListFilterForm
                        filter={paging.filter}
                        onChangeFilter={this.onChangeFilter}
                        onClose={this.changeMode}
                    />
                )}
                {mode === 'columnsShow' && (
                    <ListColumnsShowForm
                        columnsShow={paging.columnsShow}
                        onChangeColumnsShow={this.onChangeColumnsShow}
                        onClose={this.changeMode}
                    />
                )}
                    */}
            </>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        appTheme: selectAppTheme(state),
        paging: state.actualTasks.paging,
        pagingPeriod: state.actualTasks.pagingPeriod,
        items: state.actualTasks.items,
    } as PropsType
}

const mapDispatchToProps = (dispatch: AppDispatchType) => {
    return {
        dispatch: dispatch,
    } as PropsType
}

type ownPropsType = {
    actualTaskPagingRep: ActualTaskPagingExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
}

function mergeProps(
    stateProps: PropsType,
    dispatchProps: PropsType,
    ownProps: ownPropsType,
) {
    return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export const ActualTaskList = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(ActualTaskListComponent)

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
