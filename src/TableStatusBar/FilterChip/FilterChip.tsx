import { useMemo } from 'react'

import { TableData, TableInstance } from '../../TableComponent'
import { CommonChipWithPopoverAndContext } from '../CommonChipWithPopover/CommonChipWithPopover'
import { getFilterValueText } from '../../utils/getFilterValueText'

import { FilterChipDropdownContent } from './FilterChipDropdownContent'
import { getFilterChipText } from './getFilterChipText'

type FilterChipProps<TData extends TableData> = {
	table: TableInstance<TData>
	filterId: string
}

export const FilterChip = <TData extends TableData>({
	table,
	filterId,
}: FilterChipProps<TData>) => {
	const column = useMemo(() => table.getColumn(filterId), [table, filterId])

	const filterValue = column.getFilterValue() as string[]

	const currentFilterHeader = column.columnDef.header
	let text: string
	if (column.columnDef.filterChipText) {
		text = column.columnDef.filterChipText(column, table)
	} else {
		const filterValueText = getFilterValueText(
			filterValue,
			column.columnDef.filterSelectOptions
		)
		text = getFilterChipText(filterValueText)
	}
	const DropdownContent = (
		<FilterChipDropdownContent table={table} column={column} />
	)

	return (
		<div>
			<CommonChipWithPopoverAndContext
				text={text}
				title={`${currentFilterHeader}: `}
				dropdownContent={DropdownContent}
			/>
		</div>
	)
}
