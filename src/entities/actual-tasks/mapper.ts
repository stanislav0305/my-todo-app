import { ActualTaskPaging, ActualTaskView } from '../actual-tasks'
import { ActualTaskModel } from '../actual-tasks/types/actual-task.model'
import { ActualTaskPagingPeriodModel } from './types/actual-task-paging-period.model'


export const mapper = {
    mapActualTaskViewToModel(item: ActualTaskView): ActualTaskModel {
        return {
            ...item
        } satisfies ActualTaskModel as ActualTaskModel
    },
    mapActualTaskPagingToActualTaskPagingPeriodModel(entity: ActualTaskPaging) {
        return {
            ...entity
        } satisfies ActualTaskPagingPeriodModel as ActualTaskPagingPeriodModel
    },
    mapActualTaskPagingPeriodModelToActualTaskPaging(model: ActualTaskPagingPeriodModel) {
        return {
            ...model
        } satisfies ActualTaskPaging as ActualTaskPaging
    }
}