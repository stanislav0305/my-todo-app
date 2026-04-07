import { RegularTaskModel } from './regular-task.model'
import { RegularTaskPaging } from './regular-tasks-paging'


export interface RegularTasksState {
    paging: RegularTaskPaging
    items: RegularTaskModel[]
    currentItem: RegularTaskModel
}