import {
	CoreHeader,
	Header,
	HeaderGroup,
	RowData,
	Column,
	Table,
} from '@tanstack/table-core'

// Function is copy for original buildHeaderGroups from tanstack/table-core
// Its only needed to improve types

function createHeader<TData, TValue>(
	table: Table<TData>,
	column: Column<TData, TValue>,
	options: {
		id?: string
		isPlaceholder?: boolean
		placeholderId?: string
		index: number
		depth: number
	}
): Header<TData, TValue> {
	const id = options.id ?? column.id

	const header: CoreHeader<TData, TValue> = {
		id,
		column,
		index: options.index,
		isPlaceholder: !!options.isPlaceholder,
		placeholderId: options.placeholderId,
		depth: options.depth,
		subHeaders: [],
		colSpan: 0,
		rowSpan: 0,
		headerGroup: null!,
		getLeafHeaders: (): Header<TData, unknown>[] => {
			const leafHeaders: Header<TData, unknown>[] = []

			const recurseHeader = (h: CoreHeader<TData, any>) => {
				if (h.subHeaders && h.subHeaders.length) {
					h.subHeaders.map(recurseHeader)
				}
				leafHeaders.push(h as Header<TData, unknown>)
			}

			recurseHeader(header)

			return leafHeaders
		},
		getContext: () => ({
			table,
			header: header as Header<TData, TValue>,
			column,
		}),
	}

	table._features.forEach((feature) => {
		feature.createHeader?.(header as Header<TData, TValue>, table)
	})

	return header as Header<TData, TValue>
}

export function buildHeaderGroups<TData extends RowData>(
	allColumns: Column<TData, unknown>[],
	columnsToGroup: Column<TData, unknown>[],
	table: Table<TData>,
	headerFamily?: 'center' | 'left' | 'right'
) {
	// Find the max depth of the columns:
	// build the leaf column row
	// build each buffer row going up
	//    placeholder for non-existent level
	//    real column for existing level

	let maxDepth = 0

	const findMaxDepth = (columns: Column<TData, unknown>[], depth = 1) => {
		maxDepth = Math.max(maxDepth, depth)

		columns
			.filter((column) => column.getIsVisible())
			.forEach((column) => {
				if (column.columns?.length) {
					findMaxDepth(column.columns, depth + 1)
				}
			}, 0)
	}

	findMaxDepth(allColumns)

	const headerGroups: HeaderGroup<TData>[] = []

	const createHeaderGroup = (
		headersToGroup: Header<TData, unknown>[],
		depth: number
	) => {
		// The header group we are creating
		const headerGroup: HeaderGroup<TData> = {
			depth,
			id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
			headers: [],
			getNonCollapsedHeaders: () => [],
		}

		// The parent columns we're going to scan next
		const pendingParentHeaders: Header<TData, unknown>[] = []

		// Scan each column for parents
		headersToGroup.forEach((headerToGroup) => {
			// What is the latest (last) parent column?

			const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0]

			const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

			let column: Column<TData, unknown>
			let isPlaceholder = false

			if (isLeafHeader && headerToGroup.column.parent) {
				// The parent header is new
				column = headerToGroup.column.parent
			} else {
				// The parent header is repeated
				column = headerToGroup.column
				isPlaceholder = true
			}

			if (
				latestPendingParentHeader &&
				latestPendingParentHeader?.column === column
			) {
				// This column is repeated. Add it as a sub header to the next batch
				latestPendingParentHeader.subHeaders.push(headerToGroup)
			} else {
				// This is a new header. Let's create it
				const header = createHeader(table, column, {
					id: [headerFamily, depth, column.id, headerToGroup?.id]
						.filter(Boolean)
						.join('_'),
					isPlaceholder,
					placeholderId: isPlaceholder
						? `${
								pendingParentHeaders.filter((d) => d.column === column).length
						  }`
						: undefined,
					depth,
					index: pendingParentHeaders.length,
				})

				// Add the headerToGroup as a subHeader of the new header
				header.subHeaders.push(headerToGroup)
				// Add the new header to the pendingParentHeaders to get grouped
				// in the next batch
				pendingParentHeaders.push(header)
			}

			headerGroup.headers.push(headerToGroup)
			headerToGroup.headerGroup = headerGroup
		})

		headerGroups.push(headerGroup)

		if (depth > 0) {
			createHeaderGroup(pendingParentHeaders, depth - 1)
		}
	}

	const bottomHeaders = columnsToGroup.map((column, index) =>
		createHeader(table, column, {
			depth: maxDepth,
			index,
		})
	)

	createHeaderGroup(bottomHeaders, maxDepth - 1)

	headerGroups.reverse()

	const recurseHeadersForSpans = (
		headers: Header<TData, unknown>[]
	): { colSpan: number; rowSpan: number }[] => {
		const filteredHeaders = headers.filter((header) =>
			header.column.getIsVisible()
		)

		return filteredHeaders.map((header) => {
			let colSpan = 0
			let rowSpan = 0
			let childRowSpans = [0]

			if (header.subHeaders && header.subHeaders.length) {
				childRowSpans = []

				recurseHeadersForSpans(header.subHeaders).forEach(
					({ colSpan: childColSpan, rowSpan: childRowSpan }) => {
						colSpan += childColSpan
						childRowSpans.push(childRowSpan)
					}
				)
			} else {
				colSpan = 1
			}

			const minChildRowSpan = Math.min(...childRowSpans)
			rowSpan += minChildRowSpan

			header.colSpan = colSpan
			header.rowSpan = rowSpan

			return { colSpan, rowSpan }
		})
	}

	recurseHeadersForSpans(headerGroups[0]?.headers ?? [])

	return headerGroups
}
