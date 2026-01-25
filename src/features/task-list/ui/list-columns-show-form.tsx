import { DEFAULT_TASK_PAGING, TaskColumnsShow } from '@entities/tasks'
import { sharedStyles } from '@shared/styles'
import { CustomCheckbox, ThemedModal } from '@shared/ui'
import { useFormik } from 'formik'
import { StyleSheet, View } from 'react-native'
import { Button, Divider, SegmentedButtons, Text } from 'react-native-paper'

type Props = {
    columnsShow: TaskColumnsShow
    onChangeColumnsShow: (columnsShow: TaskColumnsShow) => void
    onClose: () => void
}

function getSerialNumberType(values: TaskColumnsShow) {
    return values.serialNumber
        ? 'serialNumber'
        : values.serialNumberInDay
            ? 'serialNumberInDay'
            : 'undefined'
}

export function ListColumnsShowForm({
    columnsShow,
    onChangeColumnsShow,
    onClose,
}: Props) {
    const formik = useFormik({
        initialValues: columnsShow,
        onReset: (values: TaskColumnsShow) => {
            console.log('Form reset, old data:', values)
            onChangeColumnsShow(DEFAULT_TASK_PAGING.columnsShow)
        },
        onSubmit: (values: TaskColumnsShow) => {
            console.log('Form submit:', values)
            onChangeColumnsShow(values)
        },
    })

    return (
        <ThemedModal title="Show columns" isVisible={true} onClose={onClose}>
            <Text variant="labelMedium">serial number</Text>
            <SegmentedButtons
                value={getSerialNumberType(formik.values)}
                onValueChange={value => {
                    formik.setFieldValue('serialNumber', value === 'serialNumber')
                    formik.setFieldValue(
                        'serialNumberInDay',
                        value === 'serialNumberInDay',
                    )
                }}
                buttons={[
                    {
                        value: 'undefined',
                        label: 'None',
                    },
                    {
                        value: 'serialNumber',
                        label: 'each task',
                    },
                    {
                        value: 'serialNumberInDay',
                        label: 'by day',
                    },
                ]}
            />
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.id ? 'checked' : 'unchecked'}
                onPress={() => formik.setFieldValue('id', !formik.values.id)}
            >
                <Text variant="labelMedium">id</Text>
            </CustomCheckbox>
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.date ? 'checked' : 'unchecked'}
                onPress={() => formik.setFieldValue('date', !formik.values.date)}
            >
                <Text variant="labelMedium">date</Text>
            </CustomCheckbox>
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.createdAt ? 'checked' : 'unchecked'}
                onPress={() =>
                    formik.setFieldValue('createdAt', !formik.values.createdAt)
                }
            >
                <Text variant="labelMedium">createdAt</Text>
            </CustomCheckbox>
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.updateAt ? 'checked' : 'unchecked'}
                onPress={() =>
                    formik.setFieldValue('updateAt', !formik.values.updateAt)
                }
            >
                <Text variant="labelMedium">updateAt</Text>
            </CustomCheckbox>
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.deletedAt ? 'checked' : 'unchecked'}
                onPress={() =>
                    formik.setFieldValue('deletedAt', !formik.values.deletedAt)
                }
            >
                <Text variant="labelMedium">deletedAt</Text>
            </CustomCheckbox>

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={e => formik.handleReset(e)}
                    disabled={!formik.isValid}
                    mode="contained"
                >
                    Clear
                </Button>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    icon={{ source: 'filter', direction: 'ltr' }}
                    mode="contained"
                >
                    Save
                </Button>
                <Button onPress={onClose} mode="outlined">
                    Cancel
                </Button>
            </View>
        </ThemedModal>
    )
}

const styles = StyleSheet.create({
    divider0: {
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
    divider1: {
        marginVertical: 15,
        backgroundColor: 'transparent',
    },
})
