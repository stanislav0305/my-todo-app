import { useAppTheme } from '@shared/theme-model'
import { PropsWithChildren } from 'react'
import { FieldError } from 'react-hook-form'
import { Text } from 'react-native-paper'


export interface FormErrorTextProps extends PropsWithChildren {
    errorField: FieldError | undefined
}

const FormErrorText = ({ children }: PropsWithChildren) => {
    const appTheme = useAppTheme()
    const { error } = appTheme.colors

    return (
        <Text variant='labelMedium' style={{ color: error }}>{children}</Text>
    )
}

export const FormErrorRequired = ({ errorField, children }: FormErrorTextProps) => {
    return errorField && <FormErrorText>{children}</FormErrorText>
}

export const FormErrorMaxLength = ({ errorField, children }: FormErrorTextProps) => {
    return errorField?.type === 'maxLength' && <FormErrorText>{children}</FormErrorText>
}

export const FormErrorMinLength = ({ errorField, children }: FormErrorTextProps) => {
    return errorField?.type === 'minLength' && <FormErrorText>{children}</FormErrorText>
}

export const FormErrorMin = ({ errorField, children }: FormErrorTextProps) => {
    return errorField?.type === 'min' && <FormErrorText>{children}</FormErrorText>
}

export const FormErrorMax = ({ errorField, children }: FormErrorTextProps) => {
    return errorField?.type === 'max' && <FormErrorText>{children}</FormErrorText>
}

export const FormErrorValueAsNumber = ({ errorField, children }: FormErrorTextProps) => {
    return errorField?.type === 'valueAsNumber' && <FormErrorText>{children}</FormErrorText>
}