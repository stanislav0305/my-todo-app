import { useAppDispatch } from "@/hooks/store/useAppDispatch";
import { changeSystemThemeName } from "@/store/settings.slice";
import { useEffect } from "react";
import { Appearance } from "react-native";


export const useAutomaticTheme = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(changeSystemThemeName(Appearance.getColorScheme() ?? 'light'));
        const listener = Appearance.addChangeListener(onChangeAutomaticTheme)

        return () => listener.remove()
    }, [])

    const onChangeAutomaticTheme = (aa: Appearance.AppearancePreferences) => {
        dispatch(changeSystemThemeName(aa.colorScheme ?? 'light'));
    }
}