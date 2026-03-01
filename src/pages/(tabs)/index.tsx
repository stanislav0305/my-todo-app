import ScreenLayout from '@pages/_screen-layout'
import { ActualTaskListWidget } from '@widgets/actual-task-list'


export default function ActualScreen() {
    return (
        <ScreenLayout>
            <ActualTaskListWidget />
        </ScreenLayout>
    )
}