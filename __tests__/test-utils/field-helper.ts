export const fieldHelper = {
    excludeFieldsDatesAtAndId: <T>(obj: any) => {
        // Exclude 'createdAt', 'updateAt' and 'deletedAt' fields
        const { id, createdAt, updateAt, deletedAt, ...result } = obj

        return result as T
    }
}