export const getCollapsedMultirowColIds = (
	collapsedMultirow: { id: string; colIds: string[] }[]
) => {
	return collapsedMultirow.reduce((acc, curr) => {
		acc.push(...curr.colIds)

		return acc
	}, [] as string[])
}
