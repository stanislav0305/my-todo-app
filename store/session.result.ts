import { AppThemeColors } from "@/theme/appThemes"


export type SessionResultTypes = 'Excellent' | 'VeryGood' | 'Good' | 'YouCanDoBetter' | 'NeverGiveUp'
export interface SessionResult {
    resultType: SessionResultTypes
    color: AppThemeColors
}

export const sessionResult: Map<number, SessionResult> = new Map<number, SessionResult>([
    [80, { resultType: 'Excellent', color: 'success' }],
    [50, { resultType: 'VeryGood', color: 'success' }],
    [30, { resultType: 'Good', color: 'success' }],
    [20, { resultType: 'YouCanDoBetter', color: 'warning' }],
    [10, { resultType: 'NeverGiveUp', color: 'danger' }],
])

export function getSessionResult(percent: number) {
    const arr = Array.from(sessionResult.keys())

    //find closest key
    const closestKey = arr.reduce((closest, current) => {
        const diffCurrent = Math.abs(current - percent)
        const diffClosest = Math.abs(closest - percent)

        if (diffCurrent < diffClosest)
            return current

        return closest
    }, arr[0])

    return sessionResult.get(closestKey)!
}