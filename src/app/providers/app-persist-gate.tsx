import { persistor } from '@app/model/store'
import { PropsWithChildren } from 'react'
import { PersistGate } from 'redux-persist/integration/react'


export function AppPersistGate({children}: PropsWithChildren) {
  return (
     <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
  )
}