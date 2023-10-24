export const getMultirowDepthMatchingColumns = (
	multirowHeader,
	multirowColumnsDisplayDepth
) => {
	if (multirowHeader) {
		return [...multirowHeader].filter(
			(el) => el.depth <= multirowColumnsDisplayDepth
		)
	}

	return null
}
