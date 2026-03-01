import { ActualTaskPagingPeriodModel } from './actual-task-paging-period.model'
import { ActualTaskModel } from './actual-task.model'
import { ActualTaskPagingModel } from './actual-tasks-paging.model'


export interface ActualTasksState {
    paging: ActualTaskPagingModel,
    pagingPeriod: ActualTaskPagingPeriodModel,
    items: ActualTaskModel[],
}