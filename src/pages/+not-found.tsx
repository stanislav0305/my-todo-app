import ScreenLayout from '@pages/_screen-layout'
import { Stack, useRouter } from 'expo-router'
import { Button, Text } from 'react-native-paper'


export default function NotFoundScreen() {
  const router = useRouter()

  return (
    <ScreenLayout style={{ 'justifyContent': 'center' }}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text variant='headlineLarge'>This screen does not exist.</Text>
      <Button onPress={() => router.navigate('/')}
        mode='contained'>
        Go to home screen!
      </Button>
    </ScreenLayout>
  )
}