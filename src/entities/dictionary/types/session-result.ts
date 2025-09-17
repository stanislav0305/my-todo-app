import { AppThemeColors } from '@shared/theme/lib'
import { SessionResultType } from './session-result-type'


export interface SessionResult {
    resultType: SessionResultType
    color: AppThemeColors
}