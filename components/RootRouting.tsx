import { selectAppTheme } from '@/store/settings.slice'
import { useAutomaticTheme } from '@/theme/useAutomaticTheme'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'
import { useSelector } from 'react-redux'

export default function RootRouting() {
    const appTheme =useSelector(selectAppTheme)
    useAutomaticTheme()

    return (
        <PaperProvider theme={appTheme}>
            <ThemeProvider value={appTheme}>
                <StatusBar style='auto' />
                <Stack>
                    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                    <Stack.Screen name='words-learning' options={{
                        headerShown: true,
                        title: 'Words learning'
                    }} />
                    <Stack.Screen name='settings' options={{
                        headerShown: true,
                        title: 'Settings'
                    }} />
                    <Stack.Screen name='+not-found' options={{ headerShown: false }} />
                </Stack>
                <StatusBar style='auto' />
            </ThemeProvider>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ECF0F1',
    },
})