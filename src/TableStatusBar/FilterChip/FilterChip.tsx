import { useMemo } from 'react'

import { TableData, TableInstance } from '../../TableComponent'
import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'

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
	const text = useMemo(() => getFilterChipText(filterValue), [filterValue])

	const DropdownContent = (
		<FilterChipDropdownContent table={table} column={column} />
	)

	return (
		<div>
			<CommonChipWithPopover
				text={text}
				title={`${currentFilterHeader}: `}
				dropdownContent={DropdownContent}
				table={table}
			/>
		</div>
	)
}
