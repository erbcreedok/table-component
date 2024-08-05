/** Find the maximum length of the inner arrays */
export const maxLength2d = <T>(matrix: readonly (readonly T[])[]) => {
	let result = 0

	for (const { length } of matrix) result = Math.max(result, length)

	return result
}

/** Flip rows with columns */
export const transpose2d = <T>(
	matrix: readonly (readonly T[])[],
	placeholder?: any
) => {
	const result: T[][] = []
	const maxlen = maxLength2d(matrix)
	let y = 0

	for (const { length } = matrix; y < length; y++) {
		const inner = matrix[y]
		let x = 0

		for (const { length } = inner; x < length; x++) {
			result[x] ||= []
			result[x].push(inner[x])
		}

		for (; x < maxlen; x++) {
			result[x] ||= []
			result[x].push(placeholder)
		}
	}

	return result
}

/** Remove all occurances of the element */
export const remove2d = <T>(
	matrix: readonly (readonly T[])[],
	element?: any
) => {
	const result: T[][] = []

	for (const inner of matrix) {
		const res: T[] = []

		for (const val of inner) {
			if (val !== element) res.push(val as T)
		}

		result.push(res)
	}

	return result
}
