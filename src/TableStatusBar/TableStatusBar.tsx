import { ButtonBase, styled } from '@mui/material'
import Box from '@mui/material/Box'
import React, {
	ComponentProps,
	ReactNode,
	useCallback,
	useMemo,
	useRef,
} from 'react'

import { Colors, TableData, TableInstance, TextColor } from '../'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { mergeMuiProps } from '../utils/mergeMuiProps'
import { resetGroupingWithMultirow } from '../utils/resetGroupingWithMultirow'
import { withNativeEvent } from '../utils/withNativeEvent'

import { FilterChip } from './FilterChip/FilterChip'
import { GroupingChip } from './GroupingChip/GroupingChip'
import { SortingChip } from './SortingChip/SortingChip'

const clearButtonClassName = 'clear-button'
const ClearAllButton = styled(ButtonBase)`
	color: ${({ disabled }) =>
		disabled ? TextColor.Disabled : Colors.LightBlue};
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
	&:hover .${clearButtonClassName}:not(:disabled) {
		visibility: visible;
	}
`

export type Adornment<TData = TableData> =
	| ReactNode
	| ((config: { table: TableInstance<TData> }) => ReactNode)

export type TableStatusBarWrapperProps = {
	lineProps?: ComponentProps<typeof Line>
} & ComponentProps<typeof Wrapper>

export type TableStatusBarProps<TData = TableData> = {
	table: TableInstance<TData>
	statusBarAdornment?: Adornment<TData>
} & TableStatusBarWrapperProps

export const TableStatusBar = ({
	table,
	statusBarAdornment,
	lineProps: rLineProps,
	...rest
}: TableStatusBarProps) => {
	const {
		getState,
		resetSorting,
		resetColumnFilters,
		options: {
			muiTableStatusBarWrapperProps,
			muiTableStatusClearAllButtonProps,
		},
	} = table
	const disableChips = table.constants.disableActionButtons
	const { grouping, sorting, columnFilters } = getState()

	const barRef = useRef<HTMLDivElement>(null)

	const { lineProps: mLineProps, ...mProps } = {
		...getValueOrFunctionHandler(muiTableStatusBarWrapperProps)({ table }),
	}
	const clearAllButtonProps = getValueOrFunctionHandler(
		muiTableStatusClearAllButtonProps
	)({ table })

	const handleClearAll = (event) => {
		resetGroupingWithMultirow(table)
		resetSorting(true)
		resetColumnFilters(true)
		clearAllButtonProps?.onClick?.(event)
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
		return (
			<FilterChip
				key={filter.id}
				filterId={filter.id}
				table={table}
				disabled={disableChips}
			/>
		)
	})

	const getAdornment = useCallback(
		(adornment: Adornment) => getValueOrFunctionHandler(adornment)({ table }),
		[table]
	)

	const cAdornment = useMemo(() => {
		return getAdornment(statusBarAdornment)
	}, [getAdornment, statusBarAdornment])

	if (!isAnyChipVisible && !cAdornment) return null

	return (
		<Wrapper ref={barRef} {...props}>
			<SortingChip table={table} disabled={disableChips} />

			<GroupingChip table={table} disabled={disableChips} />

			{(isGroupingExists || isSortingExists) && filterChips.length > 0 && (
				<Line {...lineProps} />
			)}

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'inherit' }}>
				{filterChips}

				{cAdornment}
				<ClearAllButton
					disabled={disableChips}
					{...clearAllButtonProps}
					className={[clearButtonClassName, clearAllButtonProps?.className]
						.filter(Boolean)
						.join()}
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
