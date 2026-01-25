import { RegularTask } from './regular-task';
import { RegularTaskPaging } from './regular-tasks-paging';


export interface RegularTasksState {
    paging: RegularTaskPaging,
    items: RegularTask[],
}