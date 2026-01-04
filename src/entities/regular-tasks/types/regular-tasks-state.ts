import { Paging } from '@shared/lib/types';
import { RegularTask } from './regular-task';


export interface RegularTasksState {
    paging: Paging<RegularTask>,
    items: RegularTask[],
}