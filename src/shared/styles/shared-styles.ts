import { StyleSheet } from 'react-native'


export const sharedStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'flex-start',
    },
    col: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'flex-start',
    },
    btnRow: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
    },
    strikethroughText: {
        textDecorationLine: 'line-through'
    },
})