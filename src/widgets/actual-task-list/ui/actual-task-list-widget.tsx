import { AppDataContext } from '@app/providers'
import { ActualTaskList } from '@features/actual-task-list'


export const ActualTaskListWidget = () => {
    return (
        <AppDataContext.Consumer>
            {value => <ActualTaskList actualTaskPagingRep={value.actualTaskPagingRep} actualTaskViewRep={value.actualTaskViewRep} />}
        </AppDataContext.Consumer>
    )
}