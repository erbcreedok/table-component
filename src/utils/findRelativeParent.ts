const relativePositions = ['relative', 'absolute', 'fixed', 'sticky']
export const findRelativeParent = <T extends HTMLElement>(el?: T | null) => {
	if (el && el.parentElement) {
		const position = getComputedStyle(el.parentElement).position
		if (relativePositions.includes(position)) return el.parentElement

		return findRelativeParent(el.parentElement)
	}

	return null
}
