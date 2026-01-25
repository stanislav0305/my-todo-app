import { AppDataContext } from '@/src/app/providers'
import { TaskList } from '@features/task-list'

export const TaskListWidget = () => {
    return (
        <AppDataContext.Consumer>
            {value => <TaskList taskRep={value.taskRep} />}
        </AppDataContext.Consumer>
    )
}