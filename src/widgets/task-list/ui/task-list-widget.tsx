import { ModificationType } from '@/src/shared/lib/types'
import { addTask, DEFAULT_TASK, deleteTask, editTask, Task } from '@entities/tasks-management'
import { TaskEditFormModal } from '@features/task-edit'
import { TaskList } from '@features/task-list'
import { useAppDispatch } from '@shared/lib/hooks'
import { RemoveFormModal } from '@shared/ui/remove-form-modal'
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
                <RemoveFormModal
                    itemKey={modeData.item.key}
                    questionText={`Do you really want to delete task '${modeData.item.title}' 
                    by key '${modeData.item.key}'?`}
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