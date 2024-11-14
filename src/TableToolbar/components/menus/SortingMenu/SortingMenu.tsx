import { Divider, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useCallback, useMemo, useState } from 'react'

import {
	ButtonLink,
	ListTitle,
	SidebarPropsWithOnCloseEnd,
	SidebarSearch,
	SidebarWithMuiProps,
	Table_Column,
	TableData,
	TableInstance,
	useTableContext,
} from '../../../../'
import { getColumnId, reorderColumn } from '../../../../column.utils'
import { DeleteIcon } from '../../../../icons/DeleteIcon'
import { createComponentWithMuiProps } from '../../../../utils/createComponentWithMuiProps'
import { getE2EAttributes } from '../../../../utils/getE2EAttributes'
import { getOrderedColumns } from '../../../../utils/getOrderedColumns'
import { getPascalCase } from '../../../../utils/getPascalCase'
import { getSortingText } from '../../../../utils/getSortingInfo'
import { getSuggestedColumns } from '../../../../utils/getSuggestedColumns'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { getValueOrFunctionHandler } from '../../../../utils/getValueOrFunctionHandler'
import { mergeMuiProps } from '../../../../utils/mergeMuiProps'
import { sortByStringArray } from '../../../../utils/sortByStringArray'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import {
	SimpleMenuItem,
	SimpleMenuItemProps,
} from '../components/SimpleMenuItem'

import { SortingButtons } from './SortingButtons'

export interface SortingMenuProps {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance
	sidebarProps?: Partial<SidebarPropsWithOnCloseEnd>
}

export const defaultOrganizeSortingMenu = (
	allColumns: readonly Table_Column[]
) => allColumns.filter((col) => col.getIsVisible() && col.getCanSort())

export const SortingMenu = ({
	anchorEl,
	setAnchorEl,
	table,
	sidebarProps,
}: SortingMenuProps) => {
	const [searchValue, setSearchValue] = useState('')
	const {
		getAllLeafColumns,
		getState,
		resetSorting,
		options: {
			innerTable,
			localization,
			suggestedColumns,
			organizeSortingMenu,
			e2eLabels,
		},
	} = table
	const [hoveredColumn, setHoveredColumn] = useState<Table_Column | null>(null)

	const onCloseEnd = sidebarProps?.onCloseEnd
	const handleCloseClick = useCallback(() => {
		setAnchorEl(null)
		onCloseEnd?.()
	}, [setAnchorEl, onCloseEnd])

	const { sorting } = getState() // this updates memo below
	const { allColumns, sortedColumns, unsortedColumns, areSuggestedShown } =
		useMemo(() => {
			const allColumns = getOrderedColumns(
				getAllLeafColumns(),
				defaultOrganizeSortingMenu,
				organizeSortingMenu
			)

			const sortingIds = sorting.map(({ id }) => id)
			const [sortedColumns, unsortedColumns] = splitArrayItems(
				allColumns,
				(col) => sortingIds.includes(getColumnId(col))
			)

			let result: Table_Column[]
			let areSuggestedShown = false

			if (searchValue)
				result = unsortedColumns.filter((col) =>
					col.columnDef.header.toLowerCase().includes(searchValue)
				)
			else
				[result, areSuggestedShown] = getSuggestedColumns(
					unsortedColumns,
					suggestedColumns?.sorting
				)

			return {
				allColumns,
				sortedColumns: sortByStringArray(
					sortedColumns,
					sortingIds,
					getColumnId
				),
				unsortedColumns: result,
				areSuggestedShown,
			}
		}, [
			getAllLeafColumns,
			organizeSortingMenu,
			sorting,
			searchValue,
			suggestedColumns?.sorting,
		])

	const onColumnOrderChanged = (
		column: Table_Column,
		hovered: Table_Column
	) => {
		const currentOrder = sorting?.map((col) => col.id)
		const newOrder = reorderColumn(column, hovered, currentOrder)

		resetSorting(true)

		newOrder.forEach((id) => {
			const target = allColumns.find(
				(col) => getColumnId(col) === id
			) as Table_Column
			const targetDirection = sorting?.find((item) => item.id === target.id)
			target.toggleSorting(targetDirection?.desc, true)
		})
	}

	const removeAllSorted = () => {
		resetSorting(true)
	}

	return (
		<SidebarWithMuiProps
			table={table}
			open={!!anchorEl}
			onClose={handleCloseClick}
			withHeader
			headerTitle={localization.sort}
			topPanel={
				<>
					<SidebarSearch value={searchValue} onValueChange={setSearchValue} />
					<Divider />
				</>
			}
			innerTableSidebar={innerTable}
			{...sidebarProps}
			PaperProps={mergeMuiProps(
				{ sx: { minWidth: 600 } },
				getTestAttributes(e2eLabels, 'sidebarSorting'),
				sidebarProps?.PaperProps
			)}
		>
			<Box sx={{ marginTop: '12px' }}>
				{searchValue ? (
					unsortedColumns.length > 0 ? (
						unsortedColumns.map((column) => (
							<MenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								setSearchValue={setSearchValue}
								isSorting
							/>
						))
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							No options
						</Typography>
					)
				) : (
					<>
						{sortedColumns.length > 0 && (
							<>
								<Box
									sx={{
										padding: '0 24px',
										margin: '12px 0 20px 0',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<ListTitle>Sorted</ListTitle>
									<ButtonLink
										onClick={withNativeEvent(
											{
												el: 'SortingSidebar_RemoveAll',
												type: 'click',
											},
											table
										)(removeAllSorted)}
										{...getTestAttributes(e2eLabels, 'sidebarSortingRemoveAll')}
									>
										{localization.removeAll}
									</ButtonLink>
								</Box>

								{sortedColumns?.map((column) => (
									<MenuItem
										column={column}
										key={column.id}
										enableDrag={sortedColumns?.length > 1}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										isSorting
										isCompact
									/>
								))}
							</>
						)}

						{unsortedColumns.length > 0 && (
							<>
								{(sortedColumns.length > 0 || areSuggestedShown) && (
									<ListTitle sx={{ padding: '0 24px', margin: '20px 0' }}>
										{areSuggestedShown
											? localization.suggested
											: localization.columns}
									</ListTitle>
								)}

								{unsortedColumns.map((column) => (
									<MenuItem
										column={column}
										key={column.id}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										isSorting
									/>
								))}
							</>
						)}
					</>
				)}
			</Box>
		</SidebarWithMuiProps>
	)
}

interface MenuItemProps<TData = TableData> extends SimpleMenuItemProps<TData> {
	setSearchValue?: React.Dispatch<React.SetStateAction<string>>
}

const MenuItem = <TData,>({
	column,
	setSearchValue,
	isCompact,
	...rest
}: MenuItemProps<TData>) => {
	const { table } = useTableContext()
	const ascSortingText = getSortingText({
		column,
		isAsc: true,
		table,
		withSortWord: false,
	})
	const descSortingText = getSortingText({
		column,
		isAsc: false,
		table,
		withSortWord: false,
	})

	return (
		<SimpleMenuItem
			disableRipple
			column={column}
			key={column.id}
			isCompact={isCompact}
			isSorting
			{...rest}
		>
			{isCompact ? (
				<>
					<SortingButtons
						column={column}
						sx={{ marginRight: '20px' }}
						e2ePrefix="sidebar"
					/>
					<IconButton
						disableRipple
						onClick={withNativeEvent(
							{
								el: `SortingSidebar_${getPascalCase(
									column.columnDef.header
								)}_Remove`,
								type: 'click',
							},
							table
						)(column.clearSorting)}
						size="small"
						{...getE2EAttributes(
							'sidebarRemoveSorting',
							`sidebarRemoveSorting_${column.id}`
						)}
					>
						<DeleteIcon />
					</IconButton>
				</>
			) : (
				<>
					<ButtonLink
						style={{ marginRight: '18px', fontWeight: 600 }}
						onClick={withNativeEvent(
							{
								el: `SortingSidebar_${getPascalCase(
									column.columnDef.header
								)}_${getPascalCase(ascSortingText)}`,
								type: 'click',
							},
							table
						)(() => {
							setSearchValue?.('')
							column.toggleSorting(false, true)
						})}
						{...getE2EAttributes(
							'sidebarSortByAsc',
							`sidebarSortByAsc_${column.id}`
						)}
					>
						{ascSortingText} +
					</ButtonLink>
					<ButtonLink
						onClick={withNativeEvent(
							{
								el: `SortingSidebar_${getPascalCase(
									column.columnDef.header
								)}_${getPascalCase(descSortingText)}`,
								type: 'click',
							},
							table
						)(() => {
							setSearchValue?.('')
							column.toggleSorting(true, true)
						})}
						style={{ fontWeight: 600 }}
						{...getE2EAttributes(
							'sidebarSortByDesc',
							`sidebarSortByDesc${column.id}`
						)}
					>
						{descSortingText} +
					</ButtonLink>
				</>
			)}
		</SimpleMenuItem>
	)
}

export const SortingMenuWithMuiProps = createComponentWithMuiProps(
	SortingMenu,
	({ table }) =>
		getValueOrFunctionHandler(table.options.muiSortingMenuProps)({
			table,
		})
)
