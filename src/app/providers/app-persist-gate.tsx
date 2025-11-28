import { persistor } from '@app/model/store'
import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { PersistGate } from 'redux-persist/integration/react'


export function AppPersistGate({ children }: PropsWithChildren) {
  return (
    <PersistGate loading={
      <Text
        style={[styles.loader]}
        variant='bodyMedium'
      >
        Loading ...
      </Text>
    } persistor={persistor}>
      {children}
    </PersistGate>
  )
}

const styles = StyleSheet.create({
  loader: {
    textAlignVertical: 'center',
    height: 38,
  },
})