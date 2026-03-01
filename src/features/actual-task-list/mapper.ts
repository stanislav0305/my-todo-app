import { ActualTaskView } from '@entities/actual-tasks'
import { RegularTaskModel } from '@entities/regular-tasks'
import { Task } from '@entities/tasks'


export const mapper = {
    mapActualTaskViewToTask(model: ActualTaskView): Task {
        throw new Error(`Not implemented code.`)
    },
    mapActualTaskViewToRegularTaskModel(model: ActualTaskView): RegularTaskModel {
        throw new Error(`Not implemented code.`)
    }
}