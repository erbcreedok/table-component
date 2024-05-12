// remove keys from object
// Usage: omit({ a: 1, b: 2, c: 3 }, 'a', 'b') => { c: 3 }
export const omit = <T extends Record<string, any>, K extends keyof T>(
	obj: T,
	...keys: K[]
): Omit<T, K> => {
	const copy = { ...obj }
	keys.forEach((key) => {
		delete copy[key]
	})

	return copy
}
