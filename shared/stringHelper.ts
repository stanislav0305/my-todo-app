export function isEmpty(value: string) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}

export function removeSpaces(str: string){
    return str.replace(/\s/g, '')
}