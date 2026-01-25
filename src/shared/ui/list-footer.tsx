import { StyleSheet } from 'react-native'
import { ActivityIndicator, Divider } from 'react-native-paper'

type Props = {
    isLoading: boolean
    color?: string | undefined
}

export const ListFooter = ({ isLoading, color }: Props) => {
    return (
        <>
            {isLoading && (
                <ActivityIndicator
                    style={{ marginVertical: 10 }}
                    animating={true}
                    color={color}
                />
            )}
            <Divider style={styles.divider} />
        </>
    )
}

const styles = StyleSheet.create({
    divider: {
        marginHorizontal: 5,
        marginVertical: 1,
        height: StyleSheet.hairlineWidth,
    },
})
