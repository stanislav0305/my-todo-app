import { Paging } from "@shared/lib/types"
import { RegularTaskColumnsShow } from "./regular-task-columns-show"
import { RegularTask } from "./regular-task.entity"
import { RegularTasksFilterModeType } from "./regular-tasks-filter-mode-type"


export type RegularTaskPaging = Paging<RegularTask, RegularTasksFilterModeType, RegularTaskColumnsShow>