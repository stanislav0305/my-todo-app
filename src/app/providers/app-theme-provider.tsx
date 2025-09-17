import { useAppTheme, useAutomaticTheme } from '@shared/theme/hooks'
import { appDarkTheme, AppTheme } from '@shared/theme/lib'
import React, { createContext, PropsWithChildren, useContext } from 'react'


interface AppThemeContextType {
    appTheme: AppTheme
}

export const AppThemeContext = createContext<AppThemeContextType>({
    appTheme: {...appDarkTheme}
} as AppThemeContextType)

export const useAppThemeContext = () => useContext(AppThemeContext)

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
    const appTheme = useAppTheme()
    useAutomaticTheme()

    return (
        <AppThemeContext.Provider value={{ appTheme }}>
            {children}
        </AppThemeContext.Provider>
    )
}

export const AppThemeConsumer = AppThemeContext.Consumer