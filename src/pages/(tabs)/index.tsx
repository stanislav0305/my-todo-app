import { TaskListWidget } from '@/src/widgets/task-list'
import ScreenLayout from '@pages/_screen-layout'


export default function TasksScreen() {
  return (
    <ScreenLayout>
      <TaskListWidget />
    </ScreenLayout>
  )
}