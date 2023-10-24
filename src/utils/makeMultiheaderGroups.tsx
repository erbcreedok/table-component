export const makeMultiheaderGroups = (
	columns,
	multirowDepthMatchingColumns,
	multirowColumnsDisplayDepth
) => {
	const allMultirowColumns: string[] = []
	const headerGroups = multirowDepthMatchingColumns
		? multirowDepthMatchingColumns
				.sort((a, b) => a.depth - b.depth)
				.reduce((acc, curr, index) => {
					curr.columns.forEach((el) => {
						const subGroups: string[] = []
						if (curr.depth < multirowColumnsDisplayDepth) {
							multirowDepthMatchingColumns
								.filter(
									(multiCols) =>
										multiCols.depth <= multirowColumnsDisplayDepth &&
										multiCols.depth === curr.depth + 1
								)
								.forEach((multiCols) => {
									multiCols.columns.forEach((cols) => {
										if (
											cols.columnIds.filter((colId) =>
												el.columnIds.includes(colId)
											).length === cols.columnIds.length
										) {
											subGroups.push(cols.text)
										}
									})
								})
						}

						acc[el.text] = {
							text: el.text,
							columns: el.columnIds?.map((colId) => {
								if (!allMultirowColumns.includes(colId)) {
									allMultirowColumns.push(colId)
								}

								return columns.find((col) => col.id === colId)
							}),
							isFinalGroup: multirowColumnsDisplayDepth === curr.depth,
							depth: index,
							subGroups,
						}

						return el
					})

					return acc
				}, {})
		: []

	return {
		headerGroups,
		allMultirowColumns,
	}
}
