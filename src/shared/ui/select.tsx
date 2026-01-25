import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { Text } from 'react-native-paper'
import { useAppTheme } from '../theme/hooks'


type Props = {
    maxHeight?: number | undefined
    label?: string | undefined
    placeholder?: string | undefined
    search?: boolean
    searchPlaceholder?: string | undefined
    labelField?: string | number | symbol
    valueField?: string | number | symbol
    value?: any
    data: any[]
    onChange: (item: any) => void
    renderItemIcon?: (item: any, selected?: boolean | undefined) => React.JSX.Element
    //renderLeftIcon?: (isFocus: boolean, focusedColor: string | OpaqueColorValue | undefined, unFocusedColor: string | OpaqueColorValue | undefined) => React.JSX.Element
    renderLeftIcon?: (isFocus: boolean, focusedColor: string | undefined, unFocusedColor: string | undefined) => React.JSX.Element
}

//Example renderLeftIcon
/*
const renderLeftIcon = (isFocus: boolean,
    focusedColor: string | OpaqueColorValue | undefined,
    unFocusedColor: string | OpaqueColorValue | undefined) => {
    return (
        <AntDesign
            color={isFocus ? focusedColor : unFocusedColor}
            name="safety"
            size={20}
        />
    )
}
*/

export function Select({ maxHeight = 300, label, placeholder, search = false, searchPlaceholder, value, data, onChange,
    labelField = 'label', valueField = 'value', renderItemIcon, renderLeftIcon }: Props) {
    const appTheme = useAppTheme()
    const { primary, secondary, secondaryContainer, background } = appTheme.colors

    const [isFocus, setIsFocus] = useState(false)

    return (
        <View style={styles.container}>
            {(!!value || isFocus) &&
                <Text style={[styles.label, {
                    color: isFocus ? primary : secondary,
                    backgroundColor: background
                }]}>
                    {label}
                </Text>
            }
            <Dropdown
                style={[styles.dropdown,
                isFocus ? { borderColor: primary, borderWidth: 2 }
                    : { borderColor: secondary, borderWidth: 1 }
                ]}
                maxHeight={maxHeight}

                placeholder={!!placeholder ? (!isFocus ? placeholder : '...') : undefined}
                placeholderStyle={styles.placeholderStyle}

                search={search}
                searchPlaceholder={searchPlaceholder}
                inputSearchStyle={[styles.inputSearchStyle, {
                    backgroundColor: background,
                }]}

                selectedTextStyle={[styles.selectedTextStyle, { color: secondary }]}

                labelField={labelField}
                valueField={valueField}
                data={data}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item: any) => {
                    onChange(item)
                    setIsFocus(false)
                }}


                containerStyle={[styles.itemsContainer, { backgroundColor: background }]}
                //itemContainerStyle
                renderItem={(item: any, selected?: boolean | undefined) => {
                    return (
                        <View style={[styles.itemContainer, {
                            backgroundColor: selected ? secondaryContainer : background,
                            borderColor: secondaryContainer
                        }]}>
                            {!!renderItemIcon &&
                                renderItemIcon(item, selected)
                            }
                            <Text>{item[labelField]}</Text>
                        </View>
                    )
                }}
                //it is dropdown right icon style
                iconStyle={styles.iconStyle}
                renderLeftIcon={
                    !!renderLeftIcon ? (visible?: boolean | undefined) => {
                        return renderLeftIcon(isFocus, primary, secondary)
                    }
                        : undefined
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        height: 40,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    container: {
        paddingTop: 16,
        paddingBottom: 0,
        paddingHorizontal: 0
    },
    label: {
        position: 'absolute',
        left: 10,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 5,
        fontSize: 12,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        paddingVertical: 8,
        paddingLeft: 14,
    },
    //it is dropdown right icon
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16
    },
    itemsContainer: {
        top: 21,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        flexWrap: "wrap",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        // backgroundColor can also be dynamic if needed
    },
})