import { styled, ButtonBase } from '@mui/material'
import React, {
	ComponentProps,
	ReactNode,
	useRef,
	useCallback,
	useMemo,
} from 'react'
import Box from '@mui/material/Box'

import { Colors } from '../components/styles'
import type { TableInstance } from '../index'
import { mergeMuiProps } from '../utils/mergeMuiProps'
import { withNativeEvent } from '../utils/withNativeEvent'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'

import { GroupingChip } from './GroupingChip/GroupingChip'
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
const Wrapper = styled(Box)`
	align-items: center;
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
	.${clearButtonClassName} {
		visibility: hidden;
	}
	&:hover .${clearButtonClassName} {
		visibility: visible;
	}
`

export type Adornment<TData extends Record<string, any> = {}> =
	| ReactNode
	| ((config: { table: TableInstance<TData> }) => ReactNode)

export type TableStatusBarWrapperProps = {
	lineProps?: ComponentProps<typeof Line>
} & ComponentProps<typeof Wrapper>

export type TableStatusBarProps<TData extends Record<string, any> = {}> = {
	table: TableInstance<TData>
	statusBarAdornment?: Adornment<TData>
} & TableStatusBarWrapperProps

export const TableStatusBar = <TData extends Record<string, any> = {}>({
	table,
	statusBarAdornment,
	lineProps: rLineProps,
	...rest
}: TableStatusBarProps<TData>) => {
	const {
		getState,
		resetSorting,
		resetColumnFilters,
		resetGrouping,
		options: { muiTableStatusBarWrapperProps },
	} = table

	const { grouping, sorting, columnFilters } = getState()

	const barRef = useRef<HTMLDivElement>(null)

	const handleClearAll = () => {
		resetGrouping(true)
		resetSorting(true)
		resetColumnFilters(true)
	}

	const { lineProps: mLineProps, ...mProps } = {
		...(typeof muiTableStatusBarWrapperProps === 'function'
			? muiTableStatusBarWrapperProps({ table })
			: muiTableStatusBarWrapperProps),
	}
	const props = mergeMuiProps<TableStatusBarWrapperProps>(
		{ sx: { p: '6px' } },
		mProps,
		rest
	)
	const lineProps = mergeMuiProps(mLineProps, rLineProps)

	const isGroupingExists = Boolean(grouping?.length)
	const isSortingExists = Boolean(sorting?.length)
	const isFiltersExists = Boolean(columnFilters?.length)
	const isAnyChipVisible =
		isGroupingExists || isSortingExists || isFiltersExists

	const filterChips = columnFilters.map((filter) => {
		return <FilterChip key={filter.id} filterId={filter.id} table={table} />
	})

	const getAdornment = useCallback(
		(adornment: Adornment<TData>) =>
			getValueOrFunctionHandler(adornment)({ table }),
		[table]
	)

	const cAdornment = useMemo(() => {
		return getAdornment(statusBarAdornment)
	}, [getAdornment, statusBarAdornment])

	if (!isAnyChipVisible && !cAdornment) return null

	return (
		<Wrapper ref={barRef} {...props}>
			<SortingChip table={table} />

			<GroupingChip table={table} />

			{(isGroupingExists || isSortingExists) && filterChips.length > 0 && (
				<Line {...lineProps} />
			)}

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'inherit' }}>
				{filterChips}

				{cAdornment}
				<ClearAllButton
					className={clearButtonClassName}
					onClick={withNativeEvent(
						{
							el: 'ActionBar_ClearAll',
							type: 'click',
						},
						table
					)(handleClearAll)}
				>
					Clear all
				</ClearAllButton>
			</Box>
		</Wrapper>
	)
}
