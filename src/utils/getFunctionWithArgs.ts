export const getFunctionWithArgs = <A extends Array<any>>(...args: A) => {
	return <T>(func: (...args: A) => T) => {
		return func(...args)
	}
}
