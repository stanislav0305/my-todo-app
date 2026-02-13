import { AppDataContext } from '@app/providers'
import { RegularTaskList } from '@features/regular-task-list'


export const RegularTaskListWidget = () => {
    return (
        <AppDataContext.Consumer>
            {value => <RegularTaskList regularTaskWeekRep={value.regularTaskWeekRep} regularTaskRep={value.regularTaskRep} />}
        </AppDataContext.Consumer>
    )
}