export const getValueOrFunctionHandler = <T, A extends Array<any>>(
	valueOrFunction?: T | ((...args: A) => T)
) => {
	return (...args: A) => {
		if (valueOrFunction instanceof Function) {
			return valueOrFunction(...args)
		}

		return valueOrFunction
	}
}
