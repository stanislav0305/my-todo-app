import { useAppData } from '@/src/app/providers/app-data-provider'
import { createTask, DEFAULT_TASK, removeTask, Task, updateTask } from '@entities/tasks-management'
import { TaskEditFormModal } from '@features/task-edit'
import { TaskList } from '@features/task-list'
import { useAppDispatch } from '@shared/lib/hooks'
import { ModificationType } from '@shared/lib/types'
import { RemoveFormModal } from '@shared/ui/remove-form-modal'
import { useState } from 'react'
import { Button } from 'react-native-paper'


interface PageState {
    mode: ModificationType,
    item: Task
}

export const TaskListWidget = () => {
    const appData = useAppData()
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
                    onChangeItem={(item: Task) => {
                        dispatch(item.id ? updateTask({ taskRep: appData.taskRep, item }) : createTask({ taskRep: appData.taskRep, item }))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
            {modeData.mode === 'remove' &&
                <RemoveFormModal
                    itemId={modeData.item.id}
                    questionText={`Do you really want to delete task '${modeData.item.title}' 
                    by id '${modeData.item.id}'?`}
                    onDelete={(id: number) => {
                        dispatch(removeTask({ taskRep: appData.taskRep, id }))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
        </>
    )
}