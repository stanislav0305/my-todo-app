export const stringHelper = {
    isEmpty: (value: string) => {
        return (value == null || (typeof value === 'string' && value.trim().length === 0));
    },

    removeSpaces: (str: string) => {
        return str.replace(/\s/g, '')
    }
}