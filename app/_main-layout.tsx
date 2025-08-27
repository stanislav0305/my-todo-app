import { selectAppTheme } from '@/store/settings.slice'
import { useAutomaticTheme } from '@/theme/useAutomaticTheme'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'
import { useSelector } from 'react-redux'


export default function MainLayout() {
    const appTheme = useSelector(selectAppTheme)
    useAutomaticTheme()

    return (
        <PaperProvider theme={appTheme}>
            <ThemeProvider value={appTheme}>
                <StatusBar style='auto' />
                    <Stack>
                        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                        <Stack.Screen name='words-learning' options={{
                            title: 'Words learning',
                            headerShown: true,
                        }} />
                        <Stack.Screen name='+not-found' options={{ headerShown: false }} />
                    </Stack>
                <StatusBar style='auto' />
            </ThemeProvider>
        </PaperProvider>
    )
}