import { act } from 'react'
import { Text } from 'react-native-paper'
import renderer from 'react-test-renderer'


describe('Text', () => {
  it('should rendered Text', () => {
    let component: any

    act(() => {
      component = renderer.create(
        <Text>test text</Text>
      )
    })

    expect(component!.toJSON()).toMatchSnapshot()
  })
})