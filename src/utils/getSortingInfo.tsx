import {
	TableInstance,
	Table_SortingFn,
	Table_Column,
	SortingType,
	TableData,
} from '../TableComponent'

const getSortingFnName = <TData extends Record<string, any> = {}>(
	sortingFn: Table_SortingFn<TData> | Table_SortingFn,
	sortingFns: Record<string, Table_SortingFn<TData> | Table_SortingFn>
) => {
	if (typeof sortingFn === 'string') return sortingFn

	return Object.entries(sortingFns).find(
		([, value]) => value === sortingFn
	)?.[0]
}

export const isNumericSorting = (sortingFnName: string) =>
	['alphanumeric', 'alphanumericCaseSensitive', 'datetime', 'basic'].includes(
		sortingFnName
	)

export const isTextSorting = (sortingFnName: string) =>
	['text', 'textCaseSensitive'].includes(sortingFnName)

export const getColumnSortingType = <TData extends TableData = TableData>(
	column: Table_Column | Table_Column<TData>,
	sortingFns: Record<string, Table_SortingFn<any>>
): SortingType => {
	if (column.columnDef.sortingType) return column.columnDef.sortingType
	const sortingFnName = getSortingFnName(column.getSortingFn(), sortingFns)
	if (!sortingFnName) return 'custom'
	if (isNumericSorting(sortingFnName)) return 'numeric'
	if (isTextSorting(sortingFnName)) return 'textual'

	return 'custom'
}

export const getSortingIconConstructor = <
	TData extends Record<string, any> = {}
>({
	column: _column,
	isAsc,
	table: _table,
}: {
	column: Table_Column | Table_Column<TData>
	isAsc: boolean
	table: TableInstance | TableInstance<TData>
}) => {
	// type assertion is needed, because other way we should add <TData> to all sorting component
	const column = _column as Table_Column<TData>
	const table = _table as TableInstance<TData>
	const _getSortingIconConstructor =
		column.columnDef.getSortingIconConstructor ??
		table.options.getSortingIconConstructor
	if (_getSortingIconConstructor) {
		return _getSortingIconConstructor({
			column,
			table,
			isAsc,
		})
	}

	const {
		options: {
			icons: {
				AscIcon,
				DescIcon,
				AscNumIcon,
				DescNumIcon,
				AscTextIcon,
				DescTextIcon,
			},
		},
	} = table
	const sortingType = getColumnSortingType(
		column,
		table.options.sortingFns ?? {}
	)

	if (sortingType === 'numeric') {
		return isAsc ? AscNumIcon : DescNumIcon
	}

	if (sortingType === 'textual') {
		return isAsc ? AscTextIcon : DescTextIcon
	}

	return isAsc ? AscIcon : DescIcon
}

export const getSortingIcon = <TData extends Record<string, any> = {}>({
	column: _column,
	isAsc,
	table: _table,
	sortingIconProps = {},
}: {
	column: Table_Column | Table_Column<TData>
	table: TableInstance | TableInstance<TData>
	isAsc: boolean
	sortingIconProps?: any
}) => {
	// type assertion is needed, because other way we should add <TData> to all sorting component
	const column = _column as Table_Column<TData>
	const table = _table as TableInstance<TData>
	const _getSortingIcon =
		column.columnDef.getSortingIcon ?? table.options.getSortingIcon
	if (_getSortingIcon) {
		return _getSortingIcon({
			column,
			table,
			isAsc,
			sortingIconProps,
		})
	}
	const SortingIcon = getSortingIconConstructor({ column, isAsc, table })

	return <SortingIcon {...sortingIconProps} />
}

export const getSortingText = <TData extends Record<string, any> = {}>({
	column: _column,
	table: _table,
	isAsc,
	withSortWord = true,
}: {
	column: Table_Column | Table_Column<TData>
	isAsc: boolean
	table: TableInstance | TableInstance<TData>
	withSortWord?: boolean
}) => {
	// type assertion is needed, because other way we should add <TData> to all sorting component
	const column = _column as Table_Column<TData>
	const table = _table as TableInstance<TData>
	const _getSortingText =
		column.columnDef.getSortingText ?? table.options.getSortingText
	if (_getSortingText) {
		return _getSortingText({
			column,
			table,
			isAsc,
			withSortWord,
		})
	}
	const {
		options: { localization },
	} = table
	let sortTypeText = isAsc ? localization.lastFirst : localization.firstLast
	const sortingType = getColumnSortingType(
		column,
		table.options.sortingFns ?? {}
	)

	if (sortingType === 'numeric') {
		sortTypeText = isAsc ? localization.ascending : localization.descending
	}

	if (sortingType === 'textual') {
		sortTypeText = isAsc ? localization.AZ : localization.ZA
	}

	return `${withSortWord ? `${localization.showSorting} ` : ''}${sortTypeText}`
}
