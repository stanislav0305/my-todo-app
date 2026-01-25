import { AppDataContext } from '@app/providers'
import { RegularTaskList } from '@features/regular-task-list'


export const RegularTaskListWidget = () => {
    return (
        <AppDataContext.Consumer>
            {value => <RegularTaskList regularTaskRep={value.regularTaskRep} />}
        </AppDataContext.Consumer>
    )
}