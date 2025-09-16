import { AppThemeConsumer, AppThemeProvider, StoreProvider } from '@app/providers'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import { PaperProvider } from 'react-native-paper'


export default function Layout() {
  return (
    <StoreProvider>
      <AppThemeProvider>
        <AppThemeConsumer>
          {context => (
            <PaperProvider theme={context.appTheme}>
              <ThemeProvider value={context.appTheme}>
                <StatusBar
                  animated={true}
                  backgroundColor={context.appTheme.dark ? '#000' : '#fff'}
                  barStyle={context.appTheme.dark ? 'light-content' : 'dark-content'}
                />
                <Stack>
                  <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                  <Stack.Screen name='words-learning' options={{
                    title: 'Words learning',
                    headerShown: true,
                  }} />
                  <Stack.Screen name='+not-found' options={{ headerShown: false }} />
                </Stack>
              </ThemeProvider>
            </PaperProvider>
          )}
        </AppThemeConsumer>
      </AppThemeProvider>
    </StoreProvider>
  )
}