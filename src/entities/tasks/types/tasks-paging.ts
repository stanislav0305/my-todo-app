import { Paging } from '@shared/lib/types'
import { Task } from 'react-native'
import { TaskColumnsShow } from './task-columns-show'
import { TasksFilterModeType } from './tasks-filter-mode-type'


export type TaskPaging = Paging<Task, TasksFilterModeType, TaskColumnsShow>