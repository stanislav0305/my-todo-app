import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from "@/components/ThemedView"
import { AppThemeNameType, changeSelectedThemeName } from '@/store/settings.slice'
import { AppDispatch, RootState } from '@/store/store'
import { Component } from 'react'
import { StyleSheet } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'
import { DispatchProp, connect } from 'react-redux'


type Props = {
    selectedThemeName: AppThemeNameType
} & DispatchProp
    & ReturnType<typeof mapStateToProps>


class SettingsScreen extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        const { selectedThemeName, dispatch } = this.props

        return (
            <ThemedView style={styles.container}>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type='title'>Settings</ThemedText>
                </ThemedView>

                <SegmentedButtons
                    value={selectedThemeName}
                    onValueChange={value => dispatch(changeSelectedThemeName(value))}
                    buttons={[
                        {
                            value: 'light',
                            label: 'light',
                        },
                        {
                            value: 'automatic',
                            label: 'automatic',
                        },
                        {
                            value: 'dark',
                            label: 'dark'
                        },
                    ]}
                />
            </ThemedView>
        )
    }
}


const mapStateToProps = (state: RootState) => ({
    selectedThemeName: state.settings.selectedThemeName,
})

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        dispatch: dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
})