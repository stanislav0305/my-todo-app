import { ComponentProps, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, List, TextInput } from 'react-native-paper'
import * as Yup from 'yup'
import { useAppTheme } from '../theme/hooks'
import { DarkAdditionalTheme } from '../theme/lib'
import { FormErrorText } from './form-error-text'


export type FieldType = 'string' | 'numberInt'

type TProps = {
  schema: Yup.ObjectSchema<any>,
  title: string,
  fieldName: string,
  fieldType: FieldType
  fieldValue: string | number,
  onSave: (fieldName: string, fieldType: FieldType, fieldValue: string | number) => void
}

type validationResult = {
  valid: boolean,
  formattedValue: string | number
}

export const EditableField = ({ schema, title, fieldName, fieldType, fieldValue, onSave }: TProps) => {

  const textInputRef: ComponentProps<typeof TextInput>['ref'] = useRef(null);
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [textInputValue, setTextInputValue] = useState<string>(fieldValue + '')
  const appTheme = useAppTheme()
  const { blueContainer, success, danger } = appTheme.colors
  const [errors, setErrors] = useState<string>('')


  const validate = (objSchema: Yup.ObjectSchema<any>, fName: string, fValue: string) => {

    let formattedValue: string | number

    if (fieldType === 'numberInt') {
      formattedValue = fValue.replace(/\D/g, '')
      if (!!formattedValue) {
        formattedValue = parseInt(formattedValue)
      }
      else {
        const error = new Error("Value can't be empty")
        console.warn('validation error:', error)
        setErrors(error.message)
        return new Promise<validationResult>((resolve, reject) => {
          resolve({ valid: false, formattedValue: fValue } as validationResult)
        })
      }
    }
    else
      formattedValue = fValue

    return objSchema
      .validate({
        [fName]: formattedValue
      })
      .then(() => {
        console.log('validation success')
        setErrors('')
        return { valid: true, formattedValue } as validationResult
      })
      .catch(error => {
        console.warn('validation error:', error)
        setErrors(error.message)
        return { valid: false, formattedValue } as validationResult
      })
  }

  return (
    <>
      <List.Item title={title} right={() =>
        <>
          <TextInput
            ref={textInputRef}
            style={isFocused ? styles.inputFocused : styles.inputUnFocused}
            keyboardType={fieldType === 'numberInt' ? 'numeric' : 'default'}
            value={textInputValue + ''}
            onBlur={() => setIsFocused(false)}
            onFocus={() => {
              textInputRef.current?.setSelection(textInputValue.length, textInputValue.length)
              setIsFocused(true)
            }}
            onChangeText={(text: string) => {
              console.log('typeof text:', typeof text)
              console.log('text:', text)

              validate(schema, fieldName, text)
                .then((result: validationResult) => {
                  setTextInputValue(result.formattedValue + '')
                })
            }}
            textColor={blueContainer}
            underlineColor={blueContainer}
            dense={true}
          />
          {isFocused &&
            <>
              <IconButton
                mode='contained'
                icon='check-circle'
                size={16}
                style={styles.btn}
                iconColor={success}
                onPress={() => {
                  validate(schema, fieldName, textInputValue)
                    .then((result: validationResult) => {
                      if (result.valid) {
                        onSave(fieldName, fieldType, result.formattedValue)
                        textInputRef.current?.blur()
                      }
                    })
                }}
              />
              <IconButton
                mode='contained'
                icon='close-circle'
                size={16}
                style={styles.btn}
                iconColor={danger}
                onPress={() => {
                  setTextInputValue(fieldValue + '')
                  setErrors('')
                  textInputRef.current?.blur()
                }}
              />
            </>
          }
        </>
      }
      />
      {!!errors && errors && <FormErrorText>{errors}</FormErrorText>}
    </>
  )
}


const styles = StyleSheet.create({
  inputUnFocused: {
    borderWidth: 0,
    textDecorationLine: 'underline',
    backgroundColor: 'transparent',
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: DarkAdditionalTheme.colors.blueContainer,
  },
  btn: {
    marginHorizontal: 4,
    paddingHorizontal: 0
  }
})