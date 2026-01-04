import ScreenLayout from '@pages/_screen-layout'
import { RegularTaskListWidget } from '@widgets/regular-task-list'


export default function TasksScreen() {
  return (
    <ScreenLayout>
      <RegularTaskListWidget />
    </ScreenLayout>
  )
}