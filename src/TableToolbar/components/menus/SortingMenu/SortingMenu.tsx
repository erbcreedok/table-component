import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Divider, IconButton, Typography } from '@mui/material'

import { TableData, useTableContext } from '../../../../index'
import type { TableInstance, Table_Column } from '../../../../index'
import {
	SimpleMenuItem,
	SimpleMenuItemProps,
} from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { getColumnId, reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'
import { Sidebar } from '../../../../components/Sidebar'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import { getSortingText } from '../../../../utils/getSortingInfo'
import { DeleteIcon } from '../../../../icons/DeleteIcon'
import { SidebarSearch } from '../../../../components/SidebarSearch'

import { SortingButtons } from './SortingButtons'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeSortingMenu = <TData extends TableData = {}>(
	allColumns: Table_Column<TData>[]
) => allColumns.filter((col) => col.getIsVisible() && col.getCanSort())

export const SortingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const [searchValue, setSearchValue] = useState('')
	const {
		getAllLeafColumns,
		getState,
		resetSorting,
		options: {
			innerTable,
			localization,
			suggestedColumns,
			organizeSortingMenu = defaultOrganizeSortingMenu,
		},
	} = table
	const { sorting } = getState()
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)
	const handleCloseClick = () => setAnchorEl(null)
	const allColumns = organizeSortingMenu(getAllLeafColumns())
	const sortedList = (sorting || []).map((item) =>
		allColumns.find((col) => getColumnId(col.columnDef) === item.id)
	)

	const [unsortedList, areSuggestedShown] = useMemo(() => {
		const unsorted = allColumns.filter((col) => !col.getIsSorted())

		if (searchValue) {
			return [
				unsorted.filter((col) =>
					col.columnDef.header.toLowerCase().includes(searchValue)
				),
				false,
			]
		}

		if (suggestedColumns?.sorting) {
			const suggested = unsorted.filter(({ id }) =>
				suggestedColumns.sorting?.includes(id)
			)

			if (suggested.length) return [suggested, true]
		}

		return [unsorted, false]
	}, [allColumns, suggestedColumns, searchValue])

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		const currentOrder = sorting?.map((col) => col.id)
		const newOrder = reorderColumn(column, hovered, currentOrder)

		resetSorting(true)

		newOrder.forEach((id) => {
			const target = allColumns.find(
				(col) => getColumnId(col.columnDef) === id
			) as Table_Column<TData>
			const targetDirection = sorting?.find((item) => item.id === target.id)
			target.toggleSorting(targetDirection?.desc, true)
		})
	}

	const removeAllSorted = () => {
		resetSorting(true)
	}

	return (
		<Sidebar
			open={!!anchorEl}
			onClose={handleCloseClick}
			styles={{ minWidth: 600 }}
			withHeader
			headerTitle={localization.sort}
			topPanel={
				<>
					<SidebarSearch value={searchValue} onValueChange={setSearchValue} />
					<Divider />
				</>
			}
			innerTableSidebar={innerTable}
		>
			<Box sx={{ marginTop: '12px' }}>
				{searchValue ? (
					unsortedList.length ? (
						unsortedList.map((column) => (
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
						{Boolean(sortedList?.length) && (
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
									<ButtonLink onClick={removeAllSorted}>Remove all</ButtonLink>
								</Box>

								{sortedList?.map((column) => (
									<MenuItem
										column={column as Table_Column<TData>}
										key={(column as Table_Column<TData>).id}
										enableDrag={sortedList?.length > 1}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										isSorting
										isCompact
									/>
								))}
							</>
						)}

						{Boolean(unsortedList.length) && (
							<>
								{(Boolean(sortedList?.length) || areSuggestedShown) && (
									<ListTitle sx={{ padding: '0 24px', margin: '20px 0' }}>
										{areSuggestedShown
											? localization.suggested
											: localization.columns}
									</ListTitle>
								)}

								{unsortedList.map((column) => (
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
		</Sidebar>
	)
}

interface MenuItemProps<TData extends Record<string, any> = {}>
	extends SimpleMenuItemProps<TData> {
	setSearchValue?: React.Dispatch<React.SetStateAction<string>>
}

const MenuItem = <TData extends Record<string, any> = {}>({
	column,
	setSearchValue,
	isCompact,
	...rest
}: MenuItemProps<TData>) => {
	const { table } = useTableContext()

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
					<SortingButtons column={column} sx={{ marginRight: '20px' }} />
					<IconButton disableRipple onClick={column.clearSorting} size="small">
						<DeleteIcon />
					</IconButton>
				</>
			) : (
				<>
					<ButtonLink
						style={{ marginRight: '18px', fontWeight: 600 }}
						onClick={() => {
							setSearchValue?.('')
							column.toggleSorting(false, true)
						}}
					>
						{getSortingText({
							table,
							sortingFn: column.getSortingFn(),
							isAsc: true,
							withSortWord: false,
						})}{' '}
						+
					</ButtonLink>
					<ButtonLink
						onClick={() => {
							setSearchValue?.('')
							column.toggleSorting(true, true)
						}}
						style={{ fontWeight: 600 }}
					>
						{getSortingText({
							table,
							sortingFn: column.getSortingFn(),
							isAsc: false,
							withSortWord: false,
						})}{' '}
						+
					</ButtonLink>
				</>
			)}
		</SimpleMenuItem>
	)
}
