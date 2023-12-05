export const arrayHasAll = (whereArr, whatArr) => {
	return whatArr.reduce((result, el) => {
		if (whereArr.indexOf(el) === -1) return false

		return true
	})
}
