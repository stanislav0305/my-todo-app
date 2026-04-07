import { ActualTaskPaging, ActualTaskView } from '../actual-tasks'
import { ActualTaskModel } from '../actual-tasks/types/actual-task.model'
import { Task } from '../tasks'
import { ActualTaskPagingPeriodModel } from './types/actual-task-paging-period.model'


export const mapper = {
    mapActualTaskViewToModel(item: ActualTaskView): ActualTaskModel {
        return {
            ...item,
            taskType: item.taskId === null && item.regularTaskId !== null ? 'RegularTask' : 'Task'
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
    },
    mapTaskToActualTaskModel(oldModel: ActualTaskModel, item: Task): ActualTaskModel {
        return {
            ...oldModel,
            taskType: 'Task',

            taskId: item.id,
            time: item.time,
            date: item.date,

            title: item.title,

            status: item.status,

            isImportant: item.isImportant,
            isUrgent: item.isUrgent,

            createdAt: item.createdAt,
            updateAt: item.updateAt,
            deletedAt: item.deletedAt,
        } as ActualTaskModel
    }
}