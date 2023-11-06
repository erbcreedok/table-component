export const ensureArray = <T>(elementOrArray: T | T[]): T[] => {
	return Array.isArray(elementOrArray) ? elementOrArray : [elementOrArray]
}
