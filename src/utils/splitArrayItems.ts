export const splitArrayItems = <T>(
	arr: readonly T[],
	checker: (item: T) => boolean
) => {
	return arr.reduce(
		(acc, item) => {
			if (checker(item)) {
				acc[0].push(item)
			} else {
				acc[1].push(item)
			}

			return acc
		},
		[[] as T[], [] as T[]]
	)
}
