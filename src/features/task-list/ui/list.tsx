import { ModificationType } from '@/src/shared/lib/types'
import { Task, selectTasks } from '@entities/tasks-management'
import { useAppSelector } from '@shared/lib/hooks'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { TaskListItem } from './list-item'


type Props = {
    onChange: (mode: ModificationType, item: Task) => void
}

export const TaskList = ({ onChange }: Props) => {
    const items = useAppSelector(selectTasks)

    return (
        <FlatList
            data={items}
            keyExtractor={((item: Task, index: number) => `task-${item.id}`)}
            renderItem={(itemInfo: ListRenderItemInfo<Task>) =>
                <TaskListItem
                    item={itemInfo.item}
                    onChange={onChange}
                />
            }
        />
    )
}