import RootRouting from '@/components/RootRouting'
import { store } from '@/store/store'
import { Provider } from 'react-redux'


export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootRouting />
    </Provider>
  )
}