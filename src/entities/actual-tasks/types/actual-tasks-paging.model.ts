import { Paging } from "@shared/lib/types"
import { ActualTaskColumnsShow } from './actual-task-columns-show'
import { ActualTaskView } from './actual-task-view.entity'
import { ActualTasksFilterModeType } from './actual-tasks-filter-mode-type'


export type ActualTaskPagingModel = Paging<ActualTaskView, ActualTasksFilterModeType, ActualTaskColumnsShow>