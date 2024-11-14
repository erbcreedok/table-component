import { useMemo } from 'react'

import { TableData, TableInstance } from '../../TableComponent'
import { getFilterValueText } from '../../utils/getFilterValueText'
import {
	CommonChipWithPopoverAndContext,
	CommonChipWithPopoverProps,
} from '../CommonChipWithPopover/CommonChipWithPopover'

import { FilterChipDropdownContent } from './FilterChipDropdownContent'
import { getFilterChipText } from './getFilterChipText'

type FilterChipProps<TData = TableData> = {
	table: TableInstance<TData>
	filterId: string
} & Partial<CommonChipWithPopoverProps>

export const FilterChip = ({ table, filterId, ...rest }: FilterChipProps) => {
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
				{...rest}
			/>
		</div>
	)
}
