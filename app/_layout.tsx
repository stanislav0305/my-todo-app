import MainLayout from '@/app/_main-layout'
import { store } from '@/store/store'
import { Provider } from 'react-redux'


export default function Layout() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  )
}