export const randomHelper = {
  genUniqueId: (): string => {
    const dateStr = Date
      .now()
      .toString(36) // convert num to base 36 and stringify

    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8) // start at index 2 to skip decimal point

    return `${dateStr}-${randomStr}`
  },

  ///Returns an Integer Random Number between min (included) and max (included)
  genRandomNumber: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  randomSortFn: () => {
    return Math.random() - 0.5
  }
}