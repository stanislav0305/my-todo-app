import { TaskRemoveFormModal } from '@/src/features/task-remove'
import { ModificationType } from '@/src/shared/lib/types'
import { addTask, DEFAULT_TASK, deleteTask, editTask, Task } from '@entities/tasks-management'
import { TaskEditFormModal } from '@features/task-edit'
import { TaskList } from '@features/task-list'
import { useAppDispatch } from '@shared/lib/hooks'
import { useState } from 'react'
import { Button } from 'react-native-paper'


interface PageState {
    mode: ModificationType,
    item: Task
}

export const TaskListWidget = () => {
    const dispatch = useAppDispatch()

    const [modeData, setModeData] = useState<PageState>({
        mode: 'none',
        item: { ...DEFAULT_TASK } as Task
    })

    const changeMode = (mode: ModificationType = 'none', item: Task = { ...DEFAULT_TASK } as Task) => {
        setModeData({
            ...modeData,
            mode: mode,
            item: item
        })
    }

    return (
        <>
            <Button
                onPress={() => changeMode('edit')}
                icon={{ source: 'plus-thick', direction: 'ltr' }}
                mode='contained'
            >
                Add task
            </Button>
            <TaskList onChange={changeMode} />
            {modeData.mode === 'edit' &&
                <TaskEditFormModal
                    item={modeData.item}
                    onChangeItem={(newItem: Task) => {
                        dispatch(newItem.key ? editTask(newItem) : addTask(newItem))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
            {modeData.mode === 'remove' &&
                <TaskRemoveFormModal
                    itemKey={modeData.item.key}
                    title={modeData.item.title}
                    onDelete={(key: string) => {
                        dispatch(deleteTask(key))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
        </>
    )
}