export const stringHelper = {
    isEmpty: (value: string | null | undefined) => {
        return ((typeof value === 'undefined') || value == null || (typeof value === 'string' && value.trim().length === 0))
    },

    removeSpaces: (str: string) => {
        return str.replace(/\s/g, '')
    },

    toNumberOrUndefinedIfNan: (str: string): number | undefined => {
        const n: number = parseInt(str, 10)
        return isNaN(n) ? undefined as number | undefined : n
    }


}