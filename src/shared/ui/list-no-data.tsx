import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

export const ListNoData = () => {
    return (
        <Text variant="labelMedium" style={styles.listNoDate}>
            No data
        </Text>
    )
}

const styles = StyleSheet.create({
    listNoDate: {
        textAlign: 'center',
        padding: 20,
    },
})
