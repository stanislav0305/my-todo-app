import ScreenLayout from '@pages/_screen-layout'
import { WordListWidget } from '@widgets/word-list'


export default function DictionaryScreen() {
  return (
    <ScreenLayout>
      <WordListWidget />
    </ScreenLayout>
  )
}