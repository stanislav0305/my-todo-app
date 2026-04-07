import { AppTheme } from '@/src/shared/theme/lib'
import { AppText } from '@/src/shared/ui'
import { act } from 'react'
import renderer, { create } from 'react-test-renderer'


const appThemeStub = {
    colors: {
        success: '#016e00ff',
        warning: '#c2d000ff'
    }
} as AppTheme

jest.mock('@shared/theme/hooks', () => ({
    useAppTheme: jest.fn().mockReturnValue(appThemeStub),
}))

describe('AppText', () => {
    it('should rended AppText with icon', async () => {
        let component: any
        act(() => {
            component = renderer.create(
                <AppText
                    iconType='info'
                    textColor='success'>
                    ZZZ2</AppText>
            )
        })

        //const instance: ReactTestInstance = component.root


        expect(component!.toJSON()).toMatchSnapshot()
    })

    it('can change icon and color', async () => {

        let component: any
        act(() => {
            component = create(
                <AppText
                    iconType='info'
                    textColor='success'>
                    ZZZ2</AppText>
            )
        })

        //console.log('ROOT:', component.root)
        expect(component!.toJSON()).toMatchSnapshot()



        //-----------------------------------------
        //Update component with other parameters
        act(() => {
            component.update(<AppText
                iconType='warning'
                textColor='warning'>
                ZZZ2</AppText>
            )
        })

        expect(component!.toJSON()).toMatchSnapshot()
    })
})