export const numberHelper = {
    padTo2Digits: (num: number) => {
        return num.toString().padStart(2, '0');
    },
    numberOrUndefinedToStringOrEmpty(n: number | undefined) {
        return typeof n === 'undefined' ? '' : n + ''
    }
}