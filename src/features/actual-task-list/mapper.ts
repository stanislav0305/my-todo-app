import { ActualTaskModel, ActualTaskView } from '@entities/actual-tasks'
import { RegularTaskModel } from '@entities/regular-tasks'
import { Task } from '@entities/tasks'


export const mapper = {
    mapActualTaskViewToTask(model: ActualTaskModel): Task {
        return {
            ...model,
            id: model.taskId,
        } as Task satisfies Task
    },
    mapActualTaskViewToRegularTaskModel(model: ActualTaskView): RegularTaskModel {
        throw new Error(`Not implemented code.`)
    }
}