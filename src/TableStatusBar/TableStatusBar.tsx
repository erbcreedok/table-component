import { styled, ButtonBase } from '@mui/material'
import React, { ComponentProps, useRef } from 'react'
import Box from '@mui/material/Box'

import { Colors } from '../components/styles'
import type { TableInstance } from '../index'

import { GroupingChip } from './GroupingChip/GroupingChip'
import { useGroupingControls } from './filter-bar-hooks/useGroupingControls'
import { SortingChip } from './SortingChip/SortingChip'
import { FilterChip } from './FilterChip/FilterChip'

const clearButtonClassName = 'clear-button'
const ClearAllButton = styled(ButtonBase)`
	color: ${Colors.LightBlue};
	font-size: 12px;
	margin-left: 9px;
	font-weight: 600;
`
const Line = styled(Box)`
	width: 1px;
	height: 24px;
	margin: 0 3px;
	background-color: ${Colors.Gray};
`
const Wrapper = styled(Box)<{ hidden?: boolean }>`
	align-items: center;
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
	${({ hidden }) => hidden && `display: none;`}
	.${clearButtonClassName} {
		visibility: hidden;
	}
	&:hover .${clearButtonClassName} {
		visibility: visible;
	}
`
type Props<TData extends Record<string, any> = {}> = {
	table: TableInstance<TData>
	lineProps?: ComponentProps<typeof Line>
} & ComponentProps<typeof Wrapper>

export const TableStatusBar = <TData extends Record<string, any> = {}>({
	table,
	lineProps,
	...rest
}: Props<TData>) => {
	const { getState, resetSorting, resetColumnFilters } = table

	const { grouping, sorting, columnFilters } = getState()

	const barRef = useRef<HTMLDivElement>(null)

	const { removeAllGroup } = useGroupingControls(table)

	const handleClearAll = () => {
		removeAllGroup()
		resetSorting()
		resetColumnFilters()
	}

	const isGroupingExists = Boolean(grouping?.length)
	const isSortingExists = Boolean(sorting?.length)
	const isFiltersExists = Boolean(columnFilters?.length)
	const isAnyChipVisible =
		isGroupingExists || isSortingExists || isFiltersExists

	const filterChips = columnFilters.map((filter) => {
		return <FilterChip key={filter.id} filterId={filter.id} table={table} />
	})

	return (
		<Wrapper ref={barRef} hidden={!isAnyChipVisible} {...rest}>
			<SortingChip table={table} />

			<GroupingChip table={table} />

			{(isGroupingExists || isSortingExists) && filterChips.length > 0 && (
				<Line {...lineProps} />
			)}

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'inherit' }}>
				{filterChips}
				<ClearAllButton
					className={clearButtonClassName}
					onClick={handleClearAll}
				>
					Clear all
				</ClearAllButton>
			</Box>
		</Wrapper>
	)
}
