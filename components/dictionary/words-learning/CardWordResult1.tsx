import { CardWord } from '@/store/dictionary.slice'
import { Result1Text } from './Result1Text'


type CardWordResult1Props = {
    item:CardWord
}

export default function CardWordResult1({ item }: CardWordResult1Props) {
    return (
        <>
            <Result1Text type='defaultSemiBold'>{item.word} Result:</Result1Text>
            {item.isExcluded &&
                <Result1Text type='default' specialColor="colorSilver">is excluded from learning</Result1Text>
            }
            {(!item.isExcluded && item.result1 === 'none') &&
                <Result1Text type='default' specialColor="colorRed">none</Result1Text>
            }
            {(!item.isExcluded && item.result1 === 'IsRemembered') &&
                <Result1Text type='default' specialColor='colorGreen'>is remembered</Result1Text>
            }
            {(!item.isExcluded && item.result1 === 'IsNotRemembered') &&
                <Result1Text type='default' specialColor='colorRed'>is not remembered</Result1Text>
            }
        </>
    )
}