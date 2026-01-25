import { Paging } from "@shared/lib/types"
import { RegularTask } from "./regular-task"
import { RegularTaskColumnsShow } from "./regular-task-columns-show"
import { RegularTasksFilterModeType } from "./regular-tasks-filter-mode-type"


export type RegularTaskPaging = Paging<RegularTask, RegularTasksFilterModeType, RegularTaskColumnsShow>