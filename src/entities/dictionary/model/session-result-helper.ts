import { SESSION_RESULTS } from '../constants'


export const sessionResultHelper = {
    getSessionResult: (percent: number) => {
        const arr = Array.from(SESSION_RESULTS.keys())

        //find closest key
        const closestKey = arr.reduce((closest, current) => {
            const diffCurrent = Math.abs(current - percent)
            const diffClosest = Math.abs(closest - percent)

            if (diffCurrent < diffClosest)
                return current

            return closest
        }, arr[0])

        return SESSION_RESULTS.get(closestKey)!
    }
}