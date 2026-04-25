import {
    ActualTaskColumnsShow, ActualTaskModel, ActualTaskPagingExtendedRepository, actualTaskPagingInit, ActualTaskPagingModel,
    ActualTaskPagingPeriodModel, actualTaskPagingUpdate, ActualTaskPeriod, ActualTasksFilterModeType, ActualTaskType, ActualTaskView,
    ActualTaskViewExtendedRepository, fetchActualTasks,
    resetPaging
} from '@entities/actual-tasks'
import { Period, RegularTaskExtendedRepository, RegularTaskModel, RegularTaskViewExtendedRepository, RegularTaskWeekExtendedRepository, removeRegTask, removeRegTaskWeek } from '@entities/regular-tasks'
import { removeTask, Task, TaskExtendedRepository, TaskStatus, updateTask } from '@entities/tasks'
import { stringHelper } from '@shared/lib/helpers'
import { AppDispatchType } from '@shared/lib/hooks'
import { DbFilter, FetchTasksTypes, ModificationType } from '@shared/lib/types'
import { AppTheme } from '@shared/theme/lib'
import { selectAppTheme } from '@shared/theme/model'
import { ListFooter, ListNoData, RemoveFormModal } from '@shared/ui'
import React, { Component } from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { Badge, Divider, Icon, IconButton, Menu, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { RegularTaskEditFormModal } from '../../regular-task-edit'
import { TaskEditFormModal } from '../../task-edit'
import { mapper } from '../mapper'
import { ListColumnsShowForm } from './list-columns-show-form'
import { ListFilterForm } from './list-filter-form'
import { ActualTaskListItem } from './list-item'
import { ListPeriodFilter } from './list-period-filter'


type StateType = {
    mode: ModificationType
    taskId: number
    regularTaskId: number
    weekId: number
    title: string
    itemType: ActualTaskType
    period: ActualTaskPeriod | null
    isLoading: boolean
    isRefreshing: boolean
    isAddTaskMenuVisible: boolean
}

type PropsType = {
    appTheme: AppTheme
    actualTaskPagingRep: ActualTaskPagingExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
    regularTaskRep: RegularTaskExtendedRepository
    regularTaskViewRep: RegularTaskViewExtendedRepository
    regularTaskWeekRep: RegularTaskWeekExtendedRepository
    taskRep: TaskExtendedRepository
    dispatch: AppDispatchType
    paging: ActualTaskPagingModel
    pagingPeriod: ActualTaskPagingPeriodModel
    items: ActualTaskModel[]
}

class ActualTaskListComponent extends Component<PropsType, StateType> {
    callOnScrollEnd = true;
    lastStartIndex: number = 0;
    keyExtractor = (item: ActualTaskView, index: number) =>
        `${item.deletedAt == null ? '' : 'deleted-'}task-${item.id}`;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            mode: 'none',
            itemType: 'Task',
            taskId: 0,
            regularTaskId: 0,
            weekId: 0,
            title: '',
            period: null,
            isLoading: false,
            isRefreshing: false,
            isAddTaskMenuVisible: false
        }
    }

    async componentDidMount() {
        const { actualTaskPagingRep, dispatch } = { ...this.props }
        await dispatch(actualTaskPagingInit({ actualTaskPagingRep }))
        this.fetchMore('fetchFromBegin')
    }

    changeMode = (mode: ModificationType = 'none', itemType: ActualTaskType = 'Task', taskId: number = 0,
        regularTaskId: number = 0, weekId: number = 0, title: string = '', period: ActualTaskPeriod | null = null) => {
        console.log(`changeMode with params mode=${mode},  itemType=${itemType}, taskId=${taskId} regularTaskId=${regularTaskId} 
            weekId=${weekId} period=${period}`)

        this.setState({
            ...this.state,
            mode,
            itemType,
            taskId,
            regularTaskId,
            weekId,
            title,
            period,
            isAddTaskMenuVisible: false
        })
    }

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
            await dispatch(fetchActualTasks({
                actualTaskViewRep: actualTaskViewRep,
                paging, fetchType, columnsShow, filter
            }))

            this.setState({
                ...this.state,
                isLoading: false,
            })

            window.clearTimeout(timeout)
        }, 1000)
    }

    onChangeColumnsShow = async (columnsShow: ActualTaskColumnsShow) => {
        console.log('onChangeColumnsShow...')
        const { dispatch, paging } = { ...this.props }

        let newPaging = Object.assign({}, paging)
        newPaging.columnsShow = columnsShow

        await dispatch(resetPaging({ paging: newPaging }))
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

    onChangeTaskStatus = async (itemId: string, status: TaskStatus) => {
        const { taskRep, actualTaskViewRep, dispatch, items } = { ...this.props }
        const actualTaskItem = { ...items.find(item => item.id === itemId)! }

        if (actualTaskItem.taskType === 'Task') {
            const item = mapper.mapActualTaskViewToTask(actualTaskItem)
            item.status = status

            await dispatch(updateTask({ taskRep, actualTaskViewRep, item }))
        } else if (actualTaskItem.taskType === 'RegularTask') {
            throw new Error('Not implemented code')
        }
    }

    onDeleteTask = async (itemType: ActualTaskType, taskId: number, regularTaskId: number, weekId: number, period: Period) => {
        //id - taskId or regularTaskId or WeekId 
        const { taskRep, actualTaskViewRep, regularTaskRep, regularTaskViewRep, regularTaskWeekRep, dispatch } = { ...this.props }
        const { mode } = { ...this.state }

        if (itemType === 'RegularTask') {
            if (period === 'everyWeek')
                await dispatch(removeRegTaskWeek({ regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, weekId, softRemove: mode === 'softRemove' }))
            else
                await dispatch(removeRegTask({ regularTaskRep, regularTaskViewRep, actualTaskViewRep, id: regularTaskId, softRemove: mode === 'softRemove' }))
        }
        else if (itemType === 'Task') {
            await dispatch(removeTask({ taskRep, actualTaskViewRep, id: taskId, softRemove: mode === 'softRemove' }))
        }

        this.changeMode()
    }

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
    }

    //--------------------------------------------------

    renderItem = (itemInfo: ListRenderItemInfo<ActualTaskModel>) => {
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

    //-------------------------------------------------------------

    toggleAddTaskMenu() {
        this.setState({
            ...this.state,
            isAddTaskMenuVisible: !this.state.isAddTaskMenuVisible,
        })
    }

    //-------------------------------------------------------------

    render() {
        const { isLoading, isRefreshing, mode, itemType, taskId, regularTaskId, weekId, title, period, isAddTaskMenuVisible } = { ...this.state }
        const { paging, pagingPeriod, items, appTheme, regularTaskRep, regularTaskViewRep,
            regularTaskWeekRep, actualTaskViewRep, taskRep } = { ...this.props }
        const { primary, onPrimary } = { ...appTheme.colors }

        console.log(`mode:${mode} itemType:${itemType} taskId:${taskId} regularTaskId:${regularTaskId} 
            weekId:${weekId} title:${title} period:${period}`)

        return (
            <>
                <View style={styles.row}>
                    {!!(paging.filter.mode !== 'inTrash') && (
                        <Menu
                            visible={isAddTaskMenuVisible}
                            onDismiss={() => this.toggleAddTaskMenu()}
                            anchor={
                                <IconButton
                                    style={{ margin: 0, marginLeft: 10 }}
                                    iconColor={onPrimary}
                                    containerColor={primary}
                                    onPress={() => this.toggleAddTaskMenu()}
                                    icon="plus-thick"
                                    mode="contained"
                                    size={20}
                                ></IconButton>
                            }>
                            <Menu.Item
                                title='Add task'
                                leadingIcon={({ size, color }) => (
                                    <Icon
                                        source='plus-thick'
                                        size={20}
                                        color={primary}
                                    />
                                )}
                                titleStyle={{ color: primary, fontWeight: 'bold' }}
                                onPress={() => { this.changeMode('edit', 'Task') }}
                            />
                            <Divider style={[styles.divider, { backgroundColor: primary }]} />
                            <Menu.Item
                                title='Add regular task'
                                leadingIcon={({ size, color }) => (
                                    <Icon
                                        source='plus-thick'
                                        size={20}
                                        color={primary}
                                    />
                                )}
                                titleStyle={{ color: primary, fontWeight: 'bold' }}
                                onPress={() => { this.changeMode('edit', 'RegularTask') }}
                            />
                        </Menu>
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
                </View>
                <ListPeriodFilter
                    model={pagingPeriod}
                    onChange={this.onChangePagingPeriod}
                />
                <View style={styles.row2}>
                    <View style={styles.row2Col1}>
                        {/* <Text variant="labelLarge" style={{ flexWrap: 'wrap' }}>
                            <Icon source={filterModes[paging.filter.mode].icon} size={20} />
                        </Text>
                        <Text variant="labelLarge" style={{ flexWrap: 'wrap' }}>
                            {` ${filterModes[paging.filter.mode].label} `}
                        </Text>*/}
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
                {mode === 'edit' && itemType === 'Task' && (
                    <TaskEditFormModal
                        taskRep={taskRep}
                        actualTaskViewRep={actualTaskViewRep}
                        id={taskId}
                        onSavedItem={(item: Task) => this.changeMode()}
                        onClose={this.changeMode}
                    />
                )}
                {mode === 'edit' && itemType === 'RegularTask' &&
                    <RegularTaskEditFormModal
                        actualTaskViewRep={actualTaskViewRep}
                        regularTaskRep={regularTaskRep}
                        regularTaskViewRep={regularTaskViewRep}
                        regularTaskWeekRep={regularTaskWeekRep}
                        id={regularTaskId}
                        onSavedItem={(item: RegularTaskModel) => this.changeMode()}
                        onClose={this.changeMode}
                    />
                }
                {mode === 'softRemove' && (
                    <RemoveFormModal
                        itemId={
                            itemType === 'Task'
                                ? taskId
                                : itemType === 'RegularTask'
                                    ? period === 'everyWeek'
                                        ? weekId
                                        : regularTaskId
                                    : -1 //'Not implemented code.'
                        }
                        softRemove={true}
                        questionText={
                            //only soft remove
                            itemType === 'Task'
                                ? `Do you really want to move to trash task '${title}' by id '${taskId}'?`
                                : itemType === 'RegularTask'
                                    ? `Do you really want to move to trash regular task '${title}' ${period === 'everyWeek'
                                        ? ` by weekId '${weekId}'`
                                        : ` by id '${regularTaskId}'`}?`
                                    : 'Not implemented code.'
                        }
                        onDelete={(id: number) => this.onDeleteTask(itemType,
                            itemType === 'Task' ? id : 0,
                            (itemType === 'RegularTask' && period !== 'everyWeek') ? id : 0,
                            (itemType === 'RegularTask' && period === 'everyWeek') ? id : 0,
                            period!)}
                        onClose={this.changeMode}
                    />
                )}
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
    regularTaskRep: RegularTaskExtendedRepository
    regularTaskViewRep: RegularTaskViewExtendedRepository
    regularTaskWeekRep: RegularTaskWeekExtendedRepository
    taskRep: TaskExtendedRepository
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
